# flask packages
from flask import Response, jsonify


def bad_request(msg=None):
    if msg is None:
        msg = "The request is missing information or is malformed."

    output = {
        "error": {
            "msg": msg
        }
    }
    resp = jsonify(output)
    resp.status_code = 400
    return resp

def unauthorized() -> Response:
    output = {
        "error": {
            "msg": "Authentication for this request is required and has either failed or is missing."
        }
    }
    resp = jsonify(output)
    resp.status_code = 401
    return resp

def conflict(msg=None):
    if msg is None:
        msg = "The request could not be completed due to a conflict"
    output = {
        "error": {
            "msg": msg
        }
    }
    resp = jsonify(output)
    resp.status_code = 409
    return resp


def forbidden() -> Response:
    output = {
        "error": {
            "msg": "403 error: The current user is not authorized to take this action."
        }
    }
    resp = jsonify(output)
    resp.status_code = 403
    return resp


def not_found(msg=None) -> Response:
    if msg is None:
        msg = "404 error: The requested resource could not be found but may be available in the future"
    output = {
        "error": {
            "msg": msg
        }
    }
    resp = jsonify(output)
    resp.status_code = 404
    return resp
