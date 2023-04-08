import requests
import json

from flask import current_app, g, url_for

from uimpactify.cli.db import ADMIN_USER
from uimpactify.controller import routes

def signup(signup_json):
    signup_url = url_for("signupapi")

    r = requests.post(signup_url, json=signup_json)
    res = r.json()
    print("New user id: ", res["id"], "\n")
    return res["id"]


def login(login_json=ADMIN_USER):
    login_url = url_for("loginapi")

    # make a request to login using the admin account created by running `flask init-db`
    r = requests.post(login_url, json=login_json)
    res = r.json()
    access_token = res["access_token"]
    print("Logged in with token:")
    print(f"{access_token}\n")
    return access_token