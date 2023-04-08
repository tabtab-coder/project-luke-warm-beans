import requests
import json

from flask import current_app, g, url_for

from uimpactify.controller import routes

def create_submission(access_token, submission_json):
    api_url = url_for("quizsubmissionsapi")

    print(f"*** CREATE QUIZ SUBMISSION ***\n")
    res = requests.post(
        api_url,
        json=submission_json,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()

    if 'error' in res:
        print(f"CREATING SUBMISSION FAILED ON: { submission_json } \n" +
            f"WHILE USING: { access_token } \n")
        print(res['error']['msg'])
        print("\n")
        return

    submission_id = res['id']
    print("New submission id: " + submission_id + "\n")
    return submission_id


def get_user_submissions(access_token):
    api_url = url_for("usersubmissionsapi")

    print(f"*** GETTING SUBMISSIONS FOR USER ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()
    print(json.dumps(res, indent=4, sort_keys=True), "\n")


def get_quiz_submission(access_token, quiz_id):
    api_url = url_for("submissionbyquizapi", quiz_id=quiz_id)

    print(f"*** GET USER SUBMISSION FOR QUIZ WITH ID: {quiz_id} ***\n")
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()
    print(json.dumps(res, indent=4, sort_keys=True), "\n")
