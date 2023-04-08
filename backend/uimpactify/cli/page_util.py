import requests
import json

from flask import current_app, g, url_for

from uimpactify.controller import routes

def update_count(page_name):
    api_url = url_for("pageapi", page_name=page_name)

    print(f"*** UPDATE VIEW COUNT FOR PAGE {page_name}***\n")
    r = requests.put(api_url)
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")
    