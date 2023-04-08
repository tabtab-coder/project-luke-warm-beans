import requests
import json

from flask import current_app, g, url_for

from uimpactify.cli.db import ADMIN_USER
from uimpactify.cli import auth_util

from uimpactify.controller import routes
from uimpactify.models.feedback_model import Feedback

def create_opportunity(access_token, opportunity_json):
    api_url = url_for("createopportunityapi")

    print(f"*** CREATE OPPORTUNITY ***\n")
    res = requests.post(
        api_url,
        json=opportunity_json,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()
    opportunity_id = res['id']
    print("New opp id: " + opportunity_id + "\n")
    return opportunity_id


def get_opportunities_by_org(access_token):
    api_url = url_for("getopportunitiesbyorgapi")

    print(f"*** GET OPPORTUNITIES ***\n")
    r = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")