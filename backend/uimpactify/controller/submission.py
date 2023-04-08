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
from uimpactify.models.submissions import Submissions
from uimpactify.models.users import Users

from uimpactify.utils.mongo_utils import convert_query, convert_doc, convert_embedded_doc, convert_embedded_query
from uimpactify.controller.errors import unauthorized, bad_request, conflict, not_found, forbidden
from uimpactify.controller.dont_crash import dont_crash, user_exists


class QuizSubmissionsApi(Resource):
    """
    Flask-resftul resource for returning db.submission collection.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def post(self) -> Response:
        """
        POST response method for creating a quiz submission.
        JSON Web Token is required.
        Student must be in the course.
        Student may only have one submission per quiz.
        """
        user = get_jwt_identity()
        data = request.get_json()
        quiz_id = data['quiz']

        # already a submission from this user
        if len(Submissions.objects(quiz=quiz_id, user=user)) != 0:
            return forbidden()

        # quiz doesn't exist
        try:
            quiz = Quizzes.objects.get(id=quiz_id)
            course = Courses.objects.get(id=quiz.course.id)
        except DoesNotExist as e:
            return not_found()

        # student must be enrolled in the course of the quiz
        courses = Courses.objects(students=user)
        if course not in courses:
            return forbidden()

        # student is in course and has not submitted
        # generate the answer key
        answer_key = {}
        for question in quiz.quizQuestions:
            answer_key[question.index] = question.answer

        # compare answer key to student responses
        student_responses = data['answers']
        grade = 0
        for response in student_responses:
            index = response['question']
            if index in answer_key and answer_key[index] == response['answer']:
                grade += 1

        try:
            data['user'] = user
            data['grade'] = grade
            submission = Submissions(**data).save()
        except ValidationError as e:
            return bad_request(e.to_dict())
        output = {'id': str(submission.id)}
        return jsonify(output)


class UserSubmissionsApi(Resource):
    """
    Flask-resftul resource for returning all a user's submissions.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self) -> Response:
        """
        GET response method for all quiz submissions by the user.
        JSON Web Token is required.
        """
        user = get_jwt_identity()
        query = Submissions.objects(user=user)
        fields = {
            'id',
            'answers',
            'grade',
        }

        embedded = {'quiz': {'id': 'quiz'}}
        response = convert_embedded_query(query, fields, embedded)
        return jsonify(response)


class SubmissionByQuizApi(Resource):
    """
    Flask-resftul resource for returning the submission for a specific quiz.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, quiz_id: str) -> Response:
        """
        GET response method for single document in Submission collection.

        :return: JSON object
        """
        user = get_jwt_identity()
        try:
            query = Submissions.objects.get(user=user, quiz=quiz_id)
        except DoesNotExist as e:
            return not_found()

        fields = {
            'id',
            'grade',
            'answers',
        }
        response = convert_doc(query, include=fields)
        return jsonify(response)

class QuizAverageApi(Resource):
    """
    Flask-resftul resource for returning the average grade of a quiz.

    """
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, quiz_id: str) -> Response:
        """
        GET response method for single document in Submission collection.

        :return: JSON object
        """
        query = Submissions.objects(quiz=quiz_id)

        # quiz doesn't exist or no one has taken it
        if len(query) == 0:
            return not_found()

        total = 0
        for submission in query:
            total += submission.grade

        response = { 'average': total/len(query) }
        return jsonify(response)
