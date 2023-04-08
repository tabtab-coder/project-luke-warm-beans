import requests
import json

from flask import current_app, g, url_for

from uimpactify.controller import routes

def create_quiz(access_token, quiz_json):
    api_url = url_for("quizzesapi")

    print(f"*** CREATE QUIZ ***\n")
    res = requests.post(
        api_url,
        json=quiz_json,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()

    if 'error' in res:
        print("CREATING QUIZ FAILED ON: " + quiz_json['name'] + "\n" +
            "WHILE USING: " + access_token + "\n")
        print(res['error']['msg'] + "\n")
        return

    quiz_id = res['id']
    print("New quiz id: " + quiz_id + "\n")
    return quiz_id


def delete_quiz(access_token, quiz_id):
    api_url = url_for("quizapi", quiz_id=quiz_id)

    print(f"*** DELETE QUIZ {quiz_id} ***\n")
    res = requests.delete(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()


def get_quiz(access_token, quiz_id):
    api_url = url_for("quizapi", quiz_id=quiz_id)

    print(f"*** GET QUIZ WITH ID: {quiz_id} ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(res.json(), indent=4, sort_keys=True), "\n")
    print("\n")


def update_quiz(access_token, quiz_id, body):
    api_url = url_for("quizapi", quiz_id=quiz_id)
    print(f"*** UPDATE QUIZ WITH ID: {quiz_id} ***\n" +
        "USING TOKEN: " + access_token + "\n"
        )
    res = requests.put(
        api_url,
        json=body,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()
    print(res)
    print("\n")


def get_quizzes(access_token):
    api_url = url_for("quizzesapi")

    print(f"*** GET QUIZZES ***\n")
    r = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")


def get_quizzes_by_course(access_token, course_id):
    api_url = url_for("quizzesbycourseapi", course_id=course_id)

    print(f"*** GET QUIZZES FOR COURSE {course_id} ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )

    # don't need to check for 'error'. not using any keys anyway
    print(json.dumps(res.json(), indent=4, sort_keys=True), "\n")
