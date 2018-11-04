import flask
from flask_cors import CORS, cross_origin
from config.config import app_config  

def create_app(config_name):
    app = flask.Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    cors = CORS(app, resources={r'/*': {'origins': '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'
    return app