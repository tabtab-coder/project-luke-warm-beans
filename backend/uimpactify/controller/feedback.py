# packages
import base64

# flask packages
from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist

# project resources
from uimpactify.models.feedback_model import Feedback
from uimpactify.models.courses import Courses
from uimpactify.models.users import Users
from uimpactify.controller.errors import forbidden


from uimpactify.utils.mongo_utils import convert_query, convert_doc, convert_embedded_doc, convert_embedded_query
from uimpactify.controller.errors import unauthorized, bad_request, conflict, not_found
from uimpactify.controller.dont_crash import dont_crash, user_exists

class FeedbackByCourseApi(Resource):
    """
    Flask-resftul resource for interacting with feedback documents.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, course_id: str) -> Response:
        """
        GET response method for all documents in course collection.
        JSON Web Token is required.

        """
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin
        user_id = get_jwt_identity()
        # make sure the course exists
        try:
            course = Courses.objects.get(id=course_id)
        except DoesNotExist:
            return not_found()

        if authorized:
            inst_id = getattr(getattr(course, 'instructor'), 'id')
            if(str(inst_id) != str(user_id)):
                query = Feedback.objects(course=course_id, public=True)
            else:
                query = Feedback.objects(course=course_id)

            res = []
            for fb in query:
                img_b64 = base64.b64encode(fb.user.image.thumbnail.read())
                fb_json = {
                    'comment': fb.comment,
                    'user': fb.user.name,
                    'image': img_b64.decode('utf-8')
                    }
                res.append(fb_json)

            return jsonify(res)
        else:
            return forbidden()

class FeedbackForCourseApi(Resource):
    """
    Flask-resftul resource for interacting with feedback documents.

    """
    @jwt_required
    @user_exists
    #@dont_crash
    def post(self) -> Response:
        authorized: bool = True #Users.objects.get(id=get_jwt_identity()).access.admin
        
        if authorized:
            data = request.get_json()

            # make sure the course exists
            try:
                course = Courses.objects.get(id=data["course"])
            except DoesNotExist:
                return not_found()

            # get the user id based off of jwt token identity
            data['user'] = get_jwt_identity()
            try:
                feedback = Feedback(**data).save()
            except ValidationError as e:
                return bad_request(e.to_dict())
            output = {'id': str(feedback.id)}
            return jsonify(output)
        else:
            return forbidden()