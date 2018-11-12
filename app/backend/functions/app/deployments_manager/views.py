import json
import yaml

from . import use_cases

from ..github_manager.views import (
    get_project_configuration,
)

def get_resources_from_cluster(cluster_json):
    resource_data = []
    location = use_cases.find_values('location', cluster_json)[0]
    node_pool = use_cases.find_values('nodePools', cluster_json)[0]
    for pool in node_pool:
        pool_resource_data = use_cases.get_resources_from_node_pool(pool)
        pool_resource_data['location'] = location
        resource_data.append(pool_resource_data)
    return resource_data


def get_project_configurations(
    access_token,
    repo_name,
    pull_request,
):
    project_id = pull_request['head']['ref']
    ref = 'refs/heads/{project_id}'.format(
        project_id=project_id,
    )
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
    deployment_yaml = yaml.load(deployment.decode("ascii"))
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
