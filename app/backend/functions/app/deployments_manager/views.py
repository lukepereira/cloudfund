import json

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


def create_cluster_from_configuration(
    access_token,
    repo_name,
    gcp_project,
    pull_request,
):
    project_id = pull_request['head']['ref']
    ref = 'refs/heads/{project_id}'.format(
        project_id=project_id,
    )
    cluster = {
        'file_type': 'json', 
        'content': get_project_configuration(
            access_token,
            repo_name,
            pull_request['head']['sha'],
            pull_request['head']['ref'],
            'clusters',
        )
    }
    cluster_json = json.loads(cluster['content'])
    cluster_status = use_cases.create_cluster(
        gcp_project,
        cluster_json['cluster']['location'],
        cluster_json,
    )
    return cluster_resp
