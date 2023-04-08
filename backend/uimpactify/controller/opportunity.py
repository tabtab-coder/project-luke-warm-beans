# packages
from bson.objectid import ObjectId
from bson.errors import InvalidId

# flask packages
from flask import Response, request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist

# project resources
from uimpactify.models.opportunity import Opportunity
from uimpactify.controller.errors import forbidden

from uimpactify.models.users import Users

from uimpactify.utils.mongo_utils import convert_query, convert_doc, convert_embedded_doc, convert_embedded_query
from uimpactify.controller.errors import unauthorized, bad_request, conflict, not_found
from uimpactify.controller.dont_crash import dont_crash, user_exists

class GetOpportunitiesByOrgApi(Resource):
    """
    Flask-resftul resource for returning db.opportunity collection.

    """

    @jwt_required
    @user_exists
    @dont_crash
    def get(self) -> Response:
        """
        GET response method for all documents related to an org.

        :return: JSON object
        """

        query = Opportunity.objects(organization=get_jwt_identity())

        authorized: bool = Users.objects.get(id=get_jwt_identity()).roles.organization or \
        Users.objects.get(id=get_jwt_identity()).roles.admin

        if authorized:
            fields = {
                'paid',
                'description',
                'published',
                'id',
            }
            converted = convert_query(query, fields)
            return jsonify(converted)
        else:
            return forbidden()



class CreateOpportunityApi(Resource):
    """
    Flask-resftul resource for creating db.opportunity collection.

    """

    @jwt_required
    @user_exists
    @dont_crash
    def post(self) -> Response:
        """
        POST response method for creating an opportunity.
        JSON Web Token is required.
        """

        data = request.get_json()

        authorized: bool = Users.objects.get(id=get_jwt_identity()).roles.organization or \
        Users.objects.get(id=get_jwt_identity()).roles.admin

        if authorized:
            data['organization'] = get_jwt_identity()
            try:
                opportunity = Opportunity(**data).save()
            except ValidationError as e:
                return bad_request(e.to_dict())

            output = {'id': str(opportunity.id)}
            return jsonify(output)
        else:
            return forbidden()


class OpportunityApi(Resource):
    """
    Flask-resftul resource for creating db.opportunity document.

    """

    @jwt_required
    @user_exists
    @dont_crash
    def delete(self, op_id: str) -> Response:
        """
        DELETE response method for deleting single opportunity.
        JSON Web Token is required.

        """

        authorized: bool = Users.objects.get(id=get_jwt_identity()).roles.organization or \
        Users.objects.get(id=get_jwt_identity()).roles.admin

        if authorized:
            try:
                output = Opportunity.objects.get(id=op_id).delete()
            except ValidationError as e:
                return bad_request(e.message)
            return jsonify(output)
        else:
            return forbidden()

    @jwt_required
    @user_exists
    @dont_crash
    def put(self, op_id: str) -> Response:
        """
        PUT response method for updating an opportunity.
        JSON Web Token is required.
        """
        data = request.get_json()

        authorized: bool = Users.objects.get(id=get_jwt_identity()).roles.organization or \
        Users.objects.get(id=get_jwt_identity()).roles.admin

        if authorized:
            try:
                res = Opportunity.objects.get(id=op_id).update(**data)
            except ValidationError as e:
                return bad_request(e.message)
            return jsonify(res)
        else:
            return forbidden()