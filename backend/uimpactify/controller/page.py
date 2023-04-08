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
# utility functions
from uimpactify.utils.mongo_utils import convert_query, convert_doc, convert_embedded_doc, convert_embedded_query
from uimpactify.controller.errors import unauthorized, bad_request, conflict, not_found
from uimpactify.controller.dont_crash import dont_crash, user_exists


class PageApi(Resource):

    @dont_crash
    def put(self, page_name) -> Response:
        # given a page_name that represents some page on the frontend that we've decided to track
        # either register the page or update the view count if it's already been registered

        # for now we plan to only track pages of the format ~courses~<course_id>, if the page
        # is not in this format, 400 error is returned

        def valid_page_name(page_name):
            # given a page_name, determine whether the page should be tracked or not
            prefix = '~courses~'
            valid = False
            if page_name.startswith('~courses~'):
                c_id = page_name[len(prefix):]
                # check the given id is for a published course
                try:
                    course = Courses.objects.get(id=c_id)
                    # make sure the course is published
                    valid = course.published
                # catch the exceptions for either the course not existing, or the given id has an invalid format
                except (DoesNotExist, ValidationError) as e:
                    valid = False 

            return valid

        # get the page with the given name (might not be registered yet)
        try:
            page = Pages.objects.get(name=page_name)
            page.views += 1
            page.save()
        except DoesNotExist:
            # check that the page is of the correct format
            if valid_page_name(page_name):
                page = {
                    'name': page_name,
                    'views': 1
                }
                page = Pages(**page).save()
            else:
                return bad_request("the page name given does not correspond with a course page on uimpactify.com")
        
        output = {'views': page.views }
        return jsonify(output)
    