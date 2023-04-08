import requests
import json
import base64
from PIL import Image
from io import BytesIO

from flask import current_app, g, url_for

from uimpactify.cli.db import ADMIN_USER
from uimpactify.cli import auth_util

from uimpactify.controller import routes
from uimpactify.models.users import Users

def get_all_users(access_token):
    api_url = url_for("users")

    print("*** GET ALL USERS ***\n")
    r = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")


def delete_self(access_token):
    api_url = url_for("selfdeleteapi")

    print("*** SELF-DELETING USER ***\n")
    # use the token as authorization in the request headers to create a course with post call
    res = requests.delete(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()


def get_self(access_token):
    api_url = url_for("signedinuserapi")

    print("*** GETTING SIGNED IN USER ***\n")
    # use the token as authorization in the request headers to create a course with post call
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(res.json(), indent=4, sort_keys=True), "\n")


def get_all_endorsed_courses(access_token):
    api_url = url_for("coursesnpohasendorsedapi")

    print("*** GETTING ALL ENDORSED COURSES ***\n")
    # use the token as authorization in the request headers to create a course with get call
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(res.json(), indent=4, sort_keys=True), "\n")


def update_picture(access_token, filename):
    api_url = url_for("signedinuserapi")

    # create the json with the image data from the given file
    with open(filename, 'rb') as img_file:
        b64_image = base64.b64encode(img_file.read())
    update_json = { 'image': b64_image.decode('utf-8') }

    print("*** SETTING PROFILE PICTURE FOR SIGNED IN USER ***\n")
    # use the token as authorization in the request headers to create a course with post call
    res = requests.put(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'},
        json=update_json,
        )


def display_picture(access_token):
    api_url = url_for("signedinuserapi")

    print("*** GETTING SIGNED IN USER PICTURE ***\n")
    # use the token as authorization in the request headers to create a course with post call
    res = requests.get(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )

    res_json = res.json()
    img_b64 = res_json['image']
    img_binary = base64.b64decode(img_b64)
    img = Image.open(BytesIO(img_binary))
    img.show()
