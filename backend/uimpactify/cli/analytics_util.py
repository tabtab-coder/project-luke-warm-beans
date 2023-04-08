import requests
import json

from flask import current_app, g, url_for

from uimpactify.controller import routes

def get_views(access_token, course_id):
    api_url = url_for("viewcountapi", course_id=course_id)

    print(f"*** GETTING VIEWS COUNT ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
    ).json()
    print(res)
    

def get_enrolled(access_token, course_id):
    api_url = url_for("enrollmentcountapi", course_id=course_id)

    print(f"*** GETTING ENROLLED COUNT ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
    ).json()
    print(res)


def get_quizzes(access_token, course_id):
    api_url = url_for("quizcountapi", course_id=course_id)

    print(f"*** GETTING PUBLISHED QUIZ COUNT ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
    ).json()
    print(res)