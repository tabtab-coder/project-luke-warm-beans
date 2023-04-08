# flask packages
from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import create_access_token, create_refresh_token

from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist

# project resources
from uimpactify.models.users import Users
from uimpactify.controller.errors import unauthorized, bad_request, conflict
from uimpactify.controller.dont_crash import dont_crash
from uimpactify.utils.mongo_utils import create_user

# external packages
import datetime


class SignUpApi(Resource):
    """
    Flask-resftul resource for creating new user.

    :Example:

    >>> from flask import Flask
    >>> from flask_restful import Api
    >>> from app import default_config

    # Create flask app, config, and resftul api, then add SignUpApi route
    >>> app = Flask(__name__)
    >>> app.config.update(default_config)
    >>> api = Api(app=app)
    >>> api.add_resource(SignUpApi, '/authentication/signup')

    """
    @staticmethod
    @dont_crash
    def post() -> Response:
        """
        POST response method for creating user.

        :return: JSON object
        """
        data = request.get_json()
        try:
            user = create_user(data)
            output = {'id': str(user.id)}
            return jsonify(output)
        except NotUniqueError as e:
            # the only unique field for a User is the email address
            # so if this error occurs, we know the given email is in use
            return conflict("Given email is already in use!")
        except ValidationError as e:
            return bad_request(e.to_dict())


class LoginApi(Resource):
    """
    Flask-resftul resource for retrieving user web token.

    :Example:

    >>> from flask import Flask
    >>> from flask_restful import Api
    >>> from app import default_config

    # Create flask app, config, and resftul api, then add LoginApi route
    >>> app = Flask(__name__)
    >>> app.config.update(default_config)
    >>> api = Api(app=app)
    >>> api.add_resource(LoginApi, '/authentication/login')

    """
    @staticmethod
    @dont_crash
    def post() -> Response:
        """
        POST response method for retrieving user web token.

        :return: JSON object
        """


        data = request.get_json()
        try:
            user = Users.objects.get(email=data.get('email'))
            auth_success = user.check_pw_hash(data.get('password'))
            if not auth_success:
                # password incorrect
                return unauthorized()
            else:
                expiry = datetime.timedelta(days=5)
                access_token = create_access_token(identity=str(user.id), expires_delta=expiry)
                refresh_token = create_refresh_token(identity=str(user.id))
                return jsonify({'access_token': access_token,
                                        'refresh_token': refresh_token,
                                        'logged_in_as': f"{user.email}"})
        except DoesNotExist as e:
            # user does not exist (email incorrect)
            return unauthorized()
