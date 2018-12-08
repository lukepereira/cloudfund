import json
import yaml

from . import use_cases
from ..github_manager.views import (
    get_project_configuration,
)


def get_resources_from_cluster(cluster):
    resource_data = []
    location = use_cases.find_values('location', cluster)[0]
    node_pool = use_cases.find_values('nodePools', cluster)[0]
    for pool in node_pool:
        pool_resource_data = use_cases.get_resources_from_node_pool(pool)
        pool_resource_data['location'] = location
        resource_data.append(pool_resource_data)
    return resource_data


def get_project_configurations_from_id(
    access_token,
    repo_name,
    project,
):
    cluster = get_project_configuration(
        access_token,
        repo_name,
        project['sha'],
        project['project_id'],
        'clusters',
    )
    cluster_json = json.loads(cluster)
    
    deployment = get_project_configuration(
        access_token,
        repo_name,
        project['sha'],
        project['project_id'],
        'deployments',
    )
    deployment_yaml = yaml.load_all(deployment.decode("ascii"))
    return cluster_json, yaml.dump(list(deployment_yaml)) #TODO: fix


def get_project_configurations_from_pr(
    access_token,
    repo_name,
    pull_request,
):
    project_id = pull_request['head']['ref']
    cluster = get_project_configuration(
        access_token,
        repo_name,
        pull_request['head']['sha'],
        pull_request['head']['ref'],
        'clusters',
    )
    cluster_json = json.loads(cluster)
    
    deployment = get_project_configuration(
        access_token,
        repo_name,
        pull_request['head']['sha'],
        pull_request['head']['ref'],
        'deployments',
    )
    # yaml.load_all returns a generator
    deployment_yaml = yaml.load_all(deployment.decode("ascii"))
    return cluster_json, deployment_yaml 


def create_cluster_from_configuration(
    gcp_project,
    cluster,
):
    cluster_response = use_cases.get_cluster(
        gcp_project,
        cluster['cluster']['location'],
        cluster,
    )
    if not cluster_response:
        cluster_response = use_cases.create_cluster(
            gcp_project,
            cluster['cluster']['location'],
            cluster,
        )
    return cluster_response


def create_deployment_from_configuration(
    gcp_project,
    cluster,
    deployment,
):
    api_instance = use_cases.get_k8_api(
        gcp_project=gcp_project,
        zone=cluster['cluster']['location'],
        cluster_id=cluster['cluster']['name'],
    )
    deployment_response = use_cases.create_deployment(
        api_instance,
        deployment,
    )
    return deployment_response


def create_deployment_from_generator(
    gcp_project,
    cluster,
    deployment_generator,
):
    api_instance = use_cases.get_k8_api(
        gcp_project=gcp_project,
        zone=cluster['cluster']['location'],
        cluster_id=cluster['cluster']['name'],
    )
    deployment_responses = []
    for deployment in deployment_generator:
        deployment_response = use_cases.create_deployment(
            api_instance,
            deployment,
        )
        deployment_responses.append(deployment_response)
    return deployment_responses


def stop_cluster_if_cost_exceeds_funds(
    access_token,
    repo_name,
    gcp_project, 
    projects,
):
    response = []
    for project in projects:
        cluster = get_project_configuration(
            access_token,
            repo_name,
            project['sha'],
            project['project_id'],
            'clusters',
        )
        cluster_json = json.loads(cluster)
        cluster_response = use_cases.scale_cluster(
            gcp_project=gcp_project,
            cluster=cluster_json,
            size=0,
        )
        response.append(cluster_response)
    return response


def enable_kubeless_on_cluster(
    gcp_project,
    cluster,
):
    api_instance = use_cases.get_k8_api(
        gcp_project=gcp_project,
        zone=cluster['cluster']['location'],
        cluster_id=cluster['cluster']['name'],
    )
    api_response = use_cases.create_namespace(
        api_instance=api_instance,
        namespace='kubeless',
    )
    kubeless_deployments = use_cases.get_kubeless_yaml()
    for deployment in kubeless_deployments:
        deployment_response = use_cases.create_deployment(
            api_instance,
            deployment,
        )
