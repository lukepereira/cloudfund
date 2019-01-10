import base64
import json
import uuid

from flask import jsonify
from flask_cors import CORS, cross_origin

from app import create_app
from app.billing_manager.views import (
    handle_monthly_payment,
    get_costs_from_bigquery,
    predict_project_cost,
    predict_cost_from_cluster_json,
)
from app.deployments_manager.views import (
    create_cluster_from_configuration,
    create_deployment_from_configuration,
    create_deployment_from_generator,
    enable_kubeless_on_cluster,
    get_cluster_json,
    get_project_configurations_from_id,
    get_project_configurations_from_pr,
    stop_cluster_if_cost_exceeds_funds,
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
    set_project_costs,
    update_project_status,
)

app = create_app('development')

@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def create_project(request):
    request_json = request.get_json()
    project_id = uuid.uuid4().hex
    cluster = get_cluster_json(
        project_id,
        request_json['cluster'],
    )
    pull_request = create_project_pull_request(
        app.config['GH_ACCESS_TOKEN'],
        app.config['GH_REPO_NAME'],
        project_id,
        request_json['project_name'],
        cluster,
        request_json['deployment'],
    )
    cost = predict_cost_from_cluster_json(
        cluster,
    )
    project = create_project_entity(
        project_id,
        request_json['project_name'],
        pull_request['url'],
        pull_request['sha'],
        cost,
        request_json['cluster'],
    )
    return project_id


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_projects(request):
    request_json = request.get_json()
    results = get_all_projects()
    return jsonify(results)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_project_by_id(request):
    request_json = request.get_json()
    results = get_project(request_json['project_id'])
    return jsonify(results)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_predicted_cost_from_project(request):
    request_json = request.get_json()
    result = predict_project_cost(
        app.config['GH_ACCESS_TOKEN'],
        app.config['GH_REPO_NAME'],
        request_json['project_id'],
    )
    return jsonify(result)
    

@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_predicted_cost_from_json(request):
    request_json = request.get_json()
    cost = predict_cost_from_cluster_json(
        request_json['cluster'],
    )
    return jsonify(cost)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_project_configurations(request):
    request_json = request.get_json()
    project = get_project(request_json['project_id'])
    cluster, deployment = get_project_configurations_from_id(
        app.config['GH_ACCESS_TOKEN'],
        app.config['GH_REPO_NAME'],
        project,
    )
    response = {
        'cluster': cluster,
        'deployment': list(deployment),
    }
    return jsonify(response)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def handle_charge(request):
    request_json = request.get_json()
    charge = create_charge(
        app.config['STRIPE_KEY'],
        request_json['stripeToken']['token'],
        request_json['amount'],
        request_json['project_id'],
    )
    status = handle_monthly_payment(
        app.config['GH_ACCESS_TOKEN'],
        app.config['GH_REPO_NAME'],
        request_json['project_id'],
    )
    return jsonify(status)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def handle_deployment_webhook(request):
    request_json = request.get_json()
    if request_json['action'] == 'closed' and request_json['pull_request']['merged'] == True:
        cluster, deployment_generator = get_project_configurations_from_pr(
            app.config['GH_ACCESS_TOKEN'],
            app.config['GH_REPO_NAME'],
            request_json['pull_request'],
        )
        cluster_response = create_cluster_from_configuration(
            app.config['GOOGLE_PROJECT_ID'],
            cluster,
        )
        #TODO: get this working
        # kubeless_response = enable_kubeless_on_cluster(
        #     app.config['GOOGLE_PROJECT_ID'],
        #     cluster,
        # )
        # deployment_response = create_deployment_from_generator(
        #     app.config['GOOGLE_PROJECT_ID'],
        #     cluster,
        #     deployment_generator,
        # )
        status_response = update_project_status(
            request_json['pull_request']['head']['ref'], 
            'pending_deployment',
        )
    return jsonify(request_json)


@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def handle_billing_pub_sub(request, context):
    '''
        Deploy: gcloud functions deploy handle_billing_pub_sub --runtime python37 --trigger-resource billing-notifications --trigger-event google.pubsub.topic.publish
        Test : { "data": "ewogICJidWRnZXREaXNwbGF5TmFtZSI6ICJCaWxsaW5nIGV2ZW50IGxpc3RlbmVyIiwKICAiYWxlcnRUaHJlc2hvbGRFeGNlZWRlZCI6IDEuMCwKICAiY29zdEFtb3VudCI6IDIuODEs
            CiAgImNvc3RJbnRlcnZhbFN0YXJ0IjogIjIwMTktMDEtMDFUMDg6MDA6MDBaIiwKICAiYnVkZ2V0QW1vdW50IjogMC4wLAogICJidWRnZXRBbW91bnRUeXBlIjogIlNQRUNJRklFRF9BTU9VTlQiLAogIC
            JjdXJyZW5jeUNvZGUiOiAiQ0FEIgp9" }
    '''
    
    if 'data' in request:
        raw_data = base64.b64decode(request['data']).decode('utf-8')
    
    json_data = json.loads(raw_data)
    cost_response = get_costs_from_bigquery(app.config['BIG_QUERY_TABLE'])
    projects = set_project_costs(cost_response)
    
    if projects['to_stop']:
        stopped_clusters = stop_cluster_if_cost_exceeds_funds(
            app.config['GH_ACCESS_TOKEN'],
            app.config['GH_REPO_NAME'],
            app.config['GOOGLE_PROJECT_ID'],
            projects['to_stop'],
        )
    for project in projects['to_deploy']:
        if project['status'] != 'running':  # use const
            cluster, deployment_generator = get_project_configurations_from_id(
                app.config['GH_ACCESS_TOKEN'],
                app.config['GH_REPO_NAME'],
                project,
            )
            deployment_response = create_deployment_from_generator(
                app.config['GOOGLE_PROJECT_ID'],
                cluster,
                deployment_generator,
            )
            status_response = update_project_status(
                project['project_id'], 
                'running',
            )
    
    return jsonify(json_data)

