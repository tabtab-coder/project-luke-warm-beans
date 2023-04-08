from uimpactify.controller.errors import bad_request, unauthorized
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist
from uimpactify.models.users import Users


def dont_crash(function):
    # catch all unhandled exceptions within a request and
    # return a 400 response
    def d_c(*args, **kwargs):
        try:
            res = function(*args, **kwargs)
            return res
        except Exception as e:
            print(e)
            return bad_request()

    return d_c    


def user_exists(function):
    # make sure user id generated from the jwt access token actually represnts
    # a User document stored in the database, return 401 response
    def u_e(*args, **kwargs):
        try:
            Users.objects.get(id=get_jwt_identity())
            return function(*args, **kwargs)
        except DoesNotExist:
            # user does not exist
            return unauthorized()
    return u_e