# binary json packages
from bson.objectid import ObjectId
from bson.errors import InvalidId

# flask packages
from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

# error handling stuffs
from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist
from uimpactify.controller.errors import forbidden

# relevant models
from uimpactify.models.pages import Pages 
from uimpactify.models.courses import Courses
from uimpactify.models.quizzes import Quizzes
from uimpactify.models.submissions import Submissions

# utility functions
from uimpactify.utils.mongo_utils import convert_query, convert_doc, convert_embedded_doc, convert_embedded_query
from uimpactify.controller.errors import unauthorized, bad_request, conflict, not_found
from uimpactify.controller.dont_crash import dont_crash, user_exists


class ViewCountApi(Resource):
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, course_id) -> Response:
        # get the view count for a course page

        # get the instructor for the course
        try:
            inst = Courses.objects.get(id=course_id).instructor
        except DoesNotExist:
            return not_found("could not find the specified course")

        authorized = (str(inst.id) == get_jwt_identity())

        if not authorized:
            return forbidden()
        # get the page with the given name (might not be registered yet)
        try:
            page_name = '~courses~' + course_id
            page = Pages.objects.get(name=page_name)
            output = {'views': page.views}
            return jsonify(output)
        except DoesNotExist:
            return not_found("this page has no views yet")
        
        

class EnrollmentCountApi(Resource):
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, course_id) -> Response:
        # get the number of people enrolled in a course

        # get the instructor for the course
        try:
            course = Courses.objects.get(id=course_id)
            inst = course.instructor
        except DoesNotExist:
            return not_found("could not find the specified course")

        authorized = (str(inst.id) == get_jwt_identity())
        if not authorized:
            return forbidden()
        
        output = {'students': len(course.students)}
        return jsonify(output)
        


class QuizCountApi(Resource):
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, course_id) -> Response:
        # get the number of *published* quizzes in a course

        # get the instructor for the course
        try:
            course = Courses.objects.get(id=course_id)
            inst = course.instructor
        except DoesNotExist:
            return not_found("could not find the specified course")

        authorized = (str(inst.id) == get_jwt_identity())
        if not authorized:
            return forbidden()
        
    
        # get all the quizzes for this course that are published
        quizzes = Quizzes.objects(course=course, published=True)
        output = {'quizzes': len(quizzes)}
        return jsonify(output)


class AveragesApi(Resource):
    @jwt_required
    @user_exists
    @dont_crash
    def get(self, course_id) -> Response:
        # get the number of *published* quizzes in a course

        # get the instructor for the course
        try:
            course = Courses.objects.get(id=course_id)
            inst = course.instructor
        except DoesNotExist:
            return not_found("could not find the specified course")

        authorized = (str(inst.id) == get_jwt_identity())
        if not authorized:
            return forbidden()
        
    
        # get all the quizzes for this course that are published
        quizzes = Quizzes.objects(course=course, published=True)
        # output will be a list of quiz objects (name, # of submissions, and average)
        output = []
        for quiz in quizzes:
            query = Submissions.objects(quiz=quiz.id)
            if (len(query) > 0 and len(quiz.quizQuestions) > 0):
                total = 0  
                for submission in query:
                    total += submission.grade
                
                average = total / (len(query) * len(quiz.quizQuestions))
                # the following two lines take the decimal average and convert it to whole number with 2 digits remaining
                # examples:
                # 0.01 -> 100.0 -> 1
                # 0.234 -> 234.0 -> 23
            
                average *= 10000
                average //= 100
                totalSubs = len(query)
            else:
                average = 0
                totalSubs = 0
            output.append({
                'quiz': quiz.name,
                'average': average,
                'totalSubmissions': totalSubs,
            })

        
        return jsonify(output)