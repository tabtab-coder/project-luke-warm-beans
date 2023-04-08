import requests
import json

from flask import current_app, g, url_for

from uimpactify.cli.db import ADMIN_USER
from uimpactify.cli import auth_util

from uimpactify.controller import routes
from uimpactify.models.feedback_model import Feedback

def create_feedback(access_token, feedback_json):
    api_url = url_for("feedbackforcourseapi")

    print(f"*** CREATE FEEDBACK FOR COURSE {feedback_json['course']} ***\n")
    # use the token as authorization in the request headers to create a feedback with post call
    res = requests.post(
        api_url,
        json=feedback_json,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()
    feedback_id = res['id']
    print("New feedback id: " + feedback_id + "\n")
    return feedback_id


def get_feedback(access_token, course_id):
    api_url = url_for("feedbackbycourseapi", course_id=course_id)

    print(f"*** GET FEEDBACK FOR COURSE {course_id} ***\n")
    r = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")