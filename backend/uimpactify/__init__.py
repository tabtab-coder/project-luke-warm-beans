# flask packages
from flask import Flask, app, g
from flask_restful import Api
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# local packages
from uimpactify.controller.routes import create_routes

# external packages
import os

# default mongodb configuration
default_config = {'MONGODB_SETTINGS': {
                    'db': 'uimpactify_dev',
                    'host': 'localhost',
                    'port': 27017,
                    'username': 'admin',
                    'password': 'password',
                    'authentication_source': 'admin'},
                  'JWT_SECRET_KEY': 'changeThisKeyFirst',
                  'SERVER_NAME': 'localhost:5000',
                  'CORS_HEADERS': 'Content-Type'}


def create_app(config: dict = None) -> app.Flask:
    """
    Initializes Flask app with given configuration.
    Main entry point for wsgi (gunicorn) server.
    :param config: Configuration dictionary
    :return: app
    """
    # init flask
    flask_app = Flask(__name__)
    CORS(flask_app)

    # configure app
    config = default_config if config is None else config
    flask_app.config.update(config)

    flask_app.config['PROPAGATE_EXCEPTIONS'] = True

    # load config variables
    if 'MONGODB_URI' in os.environ:
        flask_app.config['MONGODB_SETTINGS'] = {'host': os.environ['MONGODB_URI'],
                                                'retryWrites': False}
    if 'JWT_SECRET_KEY' in os.environ:
        flask_app.config['JWT_SECRET_KEY'] = 'ssss'

    # we're using a builder pattern to create the database and api objects
    # without affecting the state of the app

    # db takes in app as context, not the other way around

    # we use the app context to save everything to "g", 
    # this way we can get references to the db, api and jwt without
    # opening multiple instances (SINGLETON)
    # references:
    # https://flask.palletsprojects.com/en/1.0.x/patterns/appfactories/
    # https://flask.palletsprojects.com/en/1.1.x/appcontext/
    # https://flask.palletsprojects.com/en/1.1.x/api/?highlight=g#flask.g

    with flask_app.app_context():
        # init mongoengine 
        g.db = MongoEngine()
        g.db.init_app(app=flask_app)

        # init api and routes
        g.api = Api()
        create_routes(api=g.api)
        g.api.init_app(app=flask_app)

        # init jwt manager
        g.jwt = JWTManager()
        g.jwt.init_app(app=flask_app)

    # init database commands
    from uimpactify.cli import db
    db.init_app(flask_app)

    # init api commands
    from uimpactify.cli import api
    api.init_app(flask_app)

    return flask_app
