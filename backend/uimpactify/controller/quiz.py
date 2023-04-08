# packages
from bson.objectid import ObjectId
from bson.errors import InvalidId

# flask packages
from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist

# project resources
from uimpactify.models.courses import Courses
from uimpactify.models.quizzes import Quizzes
from uimpactify.models.users import Users

from uimpactify.utils.mongo_utils import convert_query, convert_doc, convert_embedded_doc, convert_embedded_query
from uimpactify.controller.errors import unauthorized, bad_request, conflict, not_found, forbidden
from uimpactify.controller.dont_crash import dont_crash, user_exists

class QuizzesApi(Resource):
    """
    Flask-resftul resource for returning db.quiz collection.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def post(self) -> Response:
        """
        POST response method for creating a quiz.
        JSON Web Token is required.
        Authorization is required: role must be instructor
        """
        user = get_jwt_identity()
        data = request.get_json()

        oid = ObjectId(user)
        authorized: bool = Courses.objects.get(id=data['course'])['instructor']['id'] == oid
        authorized = authorized or Users.objects.get(id=user).roles.admin
        if authorized:
            try:
                quiz = Quizzes(**data).save()
            except ValidationError as e:
                return bad_request(e.to_dict())
            output = {'id': str(quiz.id)}
            return jsonify(output)
        else:
            return forbidden()

    @jwt_required
    @user_exists
    @dont_crash
    def get(self) -> Response:
        """
        GET response method for all documents in quiz collection.
        JSON Web Token is required.
        """
        authorized: bool = Users.objects.get(id=get_jwt_identity()).roles.admin
        if authorized:
            query = Quizzes.objects()
            fields = {
                'id',
                'name',
                'published',
            }

            response = convert_query(query, include=fields)
            return jsonify(response)
        else:
            return forbidden()


class QuizApi(Resource):
    """
    Flask-resftul resource for returning db.quiz collection.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, quiz_id: str) -> Response:
        """
        GET response method for single document in Quizzes collection.

        :return: JSON object
        """
        try:
            quiz = Quizzes.objects.get(id=quiz_id)
        except DoesNotExist as e:
            return not_found()

        fields = {
            'id',
            'name',
            'quizQuestions',
            'published',
        }

        embedded = {'course': {'id': 'course'}}
        converted = convert_embedded_doc(quiz, fields, embedded)
        return jsonify(converted)

    @jwt_required
    @user_exists
    @dont_crash
    def put(self, quiz_id: str) -> Response:
        """
        PUT response method for updating a quiz.
        JSON Web Token is required.
        """
        query = Quizzes.objects.get(id=quiz_id)

        user = get_jwt_identity()
        # only the course instructor can delete their quizzes
        authorized: bool = query.course.instructor.id == ObjectId(user)
        # or an admin
        authorized = authorized or Users.objects.get(id=user).roles.admin
        if not authorized:
            return forbidden()

        data = request.get_json()

        if ('course' in data):
            data['course'] = ObjectId(data['course'])
        try:
            res = query.update(**data)
        except ValidationError as e:
            return bad_request(e.message)
        return jsonify(res)

    @jwt_required
    @user_exists
    @dont_crash
    def delete(self, quiz_id: str) -> Response:
        """
        DELETE response method for deleting single quiz.
        JSON Web Token is required.
        Authorization is required: Access(admin=true)

        """
        query = Quizzes.objects.get(id=quiz_id)

        user = get_jwt_identity()
        # only the course instructor can delete their quizzes
        authorized: bool = query.course.instructor.id == ObjectId(user)
        # or an admin
        authorized = authorized or Users.objects.get(id=user).roles.admin

        if authorized:
            output = query.delete()
            if output == 0:
                return not_found()
            else:
                return jsonify(output)
        else:
            return forbidden()


class QuizzesByCourseApi(Resource):
    """
    Flask-resftul resource for returning quizzes with the same course id.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, course_id: str) -> Response:
        """
        GET response method for single documents in course collection.

        :return: JSON object
        """
        # check if the given course id is valid or not
        try:
            course = Courses.objects.get(id=course_id)
        except DoesNotExist as e:
            return not_found()
        except ValidationError as e:
            return bad_request()


        user = get_jwt_identity()
        try:
            # check if the user is enrolled in the course
            queryCourse = Courses.objects.get(id=course_id, students=ObjectId(user))
            student = True
        except DoesNotExist as e:
            student = False
        
        # check if the user is the instructor of the course or if they are an admin
        inst = str(course.instructor.id) == user
        admin = Users.objects.get(id=user).roles.admin
        authorized = student or inst or admin

        if authorized:
            if inst or admin:
                query = Quizzes.objects(course=course)
            elif student:
                query = Quizzes.objects(course=course, published=True)

            fields = {
                'id',
                'name',
                'quizQuestions',
                'published',
            }

            embedded = {'course': {'id': 'course'}}
            converted = convert_embedded_query(query, fields, embedded)
            return jsonify(converted)
        else:
            return forbidden()

