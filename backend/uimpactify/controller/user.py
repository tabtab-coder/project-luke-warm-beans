# packages
import base64

# flask packages
from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

# project resources
from uimpactify.models.users import Users
from uimpactify.models.courses import Courses
from uimpactify.controller.errors import forbidden
from uimpactify.utils.mongo_utils import convert_query, convert_doc, update_user_image, create_user
from uimpactify.controller.dont_crash import dont_crash, user_exists

class UsersApi(Resource):
    """
    Flask-resftul resource for returning db.user collection.

    :Example:

    >>> from flask import Flask
    >>> from flask_restful import Api
    >>> from app import default_config

    # Create flask app, config, and resftul api, then add UsersApi route
    >>> app = Flask(__name__)
    >>> app.config.update(default_config)
    >>> api = Api(app=app)
    >>> api.add_resource(UsersApi, '/user/')

    """
    @jwt_required
    def get(self) -> Response:
        """
        GET response method for acquiring all user data.
        JSON Web Token is required.
        Authorization is required: Access(admin=true)

        :return: JSON object
        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin

        if authorized:
            query = Users.objects()
            fields = {'email', 'password', 'name', 'phone', 'roles'}
            return jsonify(convert_query(query, fields))
        else:
            return forbidden()

    @jwt_required
    def delete(self) -> Response:
        """
        DELETE response method for deleting all users.
        JSON Web Token is required.
        Authorization is required: Access(admin=true)

        :return: JSON object
        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin

        if authorized:
            output = Users.objects.delete()
            return jsonify(output)
        else:
            return forbidden()


    # it makes more sense for the USERS resource to handle the creation of a user, because
    # USERS resource handles the collection of users as a whole (adding one to the collection)

    # also, for each resource it looks like there's needs to be the same number
    # of parameters used each time. (post methods don't take in user_id's)
    @jwt_required
    def post(self: str) -> Response:
        """
        POST response method for creating user.
        JSON Web Token is required.
        Authorization is required: Access(admin=true)

        :return: JSON object
        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin

        if authorized:
            data = request.get_json()
            user = create_user(data)
            output = {'id': str(user.id)}
            return jsonify(output)
        else:
            return forbidden()


class UserApi(Resource):
    """
    Flask-resftul resource for returning db.user collection.

    :Example:

    >>> from flask import Flask
    >>> from flask_restful import Api
    >>> from app import default_config

    # Create flask app, config, and resftul api, then add UserApi route
    >>> app = Flask(__name__)
    >>> app.config.update(default_config)
    >>> api = Api(app=app)
    >>> api.add_resource(UserApi, '/user/<user_id>')

    """
    @jwt_required
    def get(self, user_id: str) -> Response:
        """
        GET response method for acquiring single user data.
        JSON Web Token is required.
        Authorization is required: Access(admin=true) or UserId = get_jwt_identity()

        :return: JSON object
        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin

        if authorized:
            user = Users.objects.get(id=user_id)
            fields = {'email', 'password', 'name', 'phone', 'roles'}
            return jsonify(convert_doc(user, fields))
        else:
            return forbidden()

    @jwt_required
    def put(self, user_id: str) -> Response:
        """
        PUT response method for updating a user.
        JSON Web Token is required.
        Authorization is required: Access(admin=true) or UserId = get_jwt_identity()

        :return: JSON object
        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin

        if authorized:
            data = request.get_json()
            put_user = Users.objects(id=user_id).update(**data)
            output = {'id': str(put_user.id)}
            return jsonify(output)
        else:
            return forbidden()

    @jwt_required
    def delete(self, user_id: str) -> Response:
        """
        DELETE response method for deleting user.
        JSON Web Token is required.
        Authorization is required: Access(admin=true)

        :return: JSON object
        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin

        if authorized:
            output = Users.objects(id=user_id).delete()
            return jsonify(output)
        else:
            return forbidden()


class SignedInUserApi(Resource):
    """
    Flask-resftul resource for returning the signed in user information.

    """

    @jwt_required
    @dont_crash
    @user_exists
    def get(self) -> Response:
        """
        GET response method for getting information on currently logged in user.
        JSON Web Token is required.

        :return: JSON object
        """
        user = Users.objects().get(id=get_jwt_identity())
        output = convert_doc(user, {'name', 'email', 'phone', 'roles'})
        # get the image
        img_binary = user.image.read()
        img_b64 = base64.b64encode(img_binary)
        output['image'] = img_b64.decode('utf-8')
        return jsonify(output)

    @jwt_required
    @dont_crash
    @user_exists
    def put(self) -> Response:
        """
        PUT response method for updating information on currently logged in user.
        JSON Web Token is required.

        :return: JSON object
        """
        data = request.get_json()
        try:
            user = Users.objects.get(id=get_jwt_identity())

            # update image manually
            if 'image' in data:
                update_user_image(user, data.pop('image'))
            # update remaining fields as necessary
            if len(data) > 0:
                res = user.update(**data)
        except ValidationError as e:
            return bad_request(e.message)


class SelfDeleteApi(Resource):
    """
    Flask-resftul resource for returning db.user collection.

    """

    @jwt_required
    @dont_crash
    @user_exists
    def delete(self) -> Response:
        """
        DELETE response method for deleting currently logged in user.
        JSON Web Token is required.

        :return: JSON object
        """
        output = Users.objects(id=get_jwt_identity()).delete()
        return jsonify(output)

class CoursesNpoHasEndorsedApi(Resource):
    """
    Flask-resftul resource for returning all courses endorsed by an npo

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self) -> Response:
        """
        GET response method for returning all courses endorsed by an npo

        :return: JSON object
        """
        user_id = get_jwt_identity()

        query = Courses.objects(endorsedBy=user_id)

        fields = {
            'id',
            'name'
            }
        values = convert_query(query, fields)
        return jsonify(values)
