import json
import uuid

from flask import jsonify
from flask_cors import CORS, cross_origin

from app import create_app
from app.billing_manager.views import (
    predict_project_cost,
    predict_cost_from_cluster_json,
)
from app.github_manager.views import (
    create_project_pull_request,
)
from app.payments_manager.views import (
    create_charge,
)
from app.projects_manager.views import (
    create_project_entity,
    get_all_projects,
    get_project,
)

app = create_app('development')


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def create_project(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/0.12/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
        
    Deploy:
        gcloud beta functions deploy create_project --runtime python37 --trigger-http 
    Test:
        {
            "project_name": "test", 
            "deployment": {"format":"yaml", "content": "test"},
            "cluster": {"format": "json", "content": "test"}
        }
    """
    
    request_json = request.get_json()
    project_id = uuid.uuid4().hex
    
    pull_request = create_project_pull_request(
        app.config['GH_ACCESS_TOKEN'],
        app.config['GH_REPO_NAME'],
        project_id,
        request_json['cluster'],
        request_json['deployment'],
    )
    cost = predict_cost_from_cluster_json(
        request_json['cluster'],
    )
    project = create_project_entity(
        project_id,
        request_json['project_name'],
        request_json['project_url'],
        pull_request['url'],
        pull_request['sha'],
        cost,
    )
    
    return project_id


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_projects(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/0.12/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
        
    Deploy:
        gcloud beta functions deploy get_projects --runtime python37 --trigger-http 
    Test:
        {}
    """
    request_json = request.get_json()
    results = get_all_projects()
    return jsonify(results)


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_project_by_id(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/0.12/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
        
    Deploy:
        gcloud beta functions deploy get_project --runtime python37 --trigger-http 
    Test:
        {"project_id": ""}
    """
    request_json = request.get_json()
    results = get_project(request_json['project_id'])
    return jsonify(results)


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_predicted_cost_from_project(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/0.12/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
        
    Deploy:
        gcloud beta functions deploy get_predicted_cost --runtime python37 --trigger-http 
    Test:
        {"project_id": ""}
    """
    
    request_json = request.get_json()
    result = predict_project_cost(
        app.config['GH_ACCESS_TOKEN'],
        app.config['GH_REPO_NAME'],
        request_json['project_id'],
    )
    return jsonify(result)
    

@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_predicted_cost_from_json(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/0.12/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
        
    Deploy:
        gcloud beta functions deploy get_predicted_cost_from_json --runtime python37 --trigger-http 
    Test:
        {"project_id": ""}
    """
    
    request_json = request.get_json()
    cost = predict_cost_from_cluster_json(
        request_json['cluster'],
    )
    return jsonify(cost)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def handle_charge(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/0.12/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
    Deploy:
        gcloud beta functions deploy handle_charge --runtime python37 --trigger-http 
    Test:
        {"project_id": "", "stripeToken": "", "amount": 0}
    """
    request_json = request.get_json()
    charge = create_charge(
        app.config['STRIPE_KEY'],
        request_json['stripeToken']['token'],
        request_json['amount'],
        request_json['project_id'],
    )
    
    return jsonify(charge)

