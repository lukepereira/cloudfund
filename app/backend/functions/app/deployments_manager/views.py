import json
import yaml

from . import constants
from . import use_cases
from ..github_manager.views import (
    get_project_configuration,
)


def get_cluster_json(project_id, cluster):
    # cluster_json = json.loads()
    if cluster['format'] == constants.CLUSTER_FORM_TYPES['JSON']:
        return cluster
    if cluster['format'] == constants.CLUSTER_FORM_TYPES['TEMPLATE']:
        cluster_tempate_json = use_cases.get_cluster_json_from_template(
            project_id=project_id,
            cluster_template=cluster['content'],
        )
        cluster['content'] = json.dumps(cluster_tempate_json, indent=4) 
        cluster['format'] = constants.CLUSTER_FORM_TYPES['JSON']
        return cluster


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
    return cluster_json, deployment_yaml


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
        api_instance=api_instance,
        deployment=deployment,
    )
    return deployment_response


def create_deployment_from_generator(
    gcp_project,
    cluster,
    deployment_generator,
    project_status,
):
    api_instance = use_cases.get_k8_api(
        gcp_project=gcp_project,
        zone=cluster['cluster']['location'],
        cluster_id=cluster['cluster']['name'],
    )
    
    deployment_responses = []
    for deployment in deployment_generator:
        deployment_response = {}
        
        if deployment['kind'] == 'Service' and project_status != 'running':
            service_response = create_service_from_configuration(
                gcp_project=gcp_project,
                cluster=cluster,
                service=deployment,
            )
        else:
            deployment_response = use_cases.create_deployment(
                api_instance=api_instance,
                deployment=deployment,
            )
        deployment_responses.append(deployment_response)
    return deployment_responses


def create_service_from_configuration(
    gcp_project,
    cluster,
    service,
):
    v1_api_instance = use_cases.get_k8_api(
        gcp_project=gcp_project,
        zone=cluster['cluster']['location'],
        cluster_id=cluster['cluster']['name'],
        client_version='CoreV1Api'
    )
    service_response = use_cases.create_service(
        api_instance=v1_api_instance,
        service=service,
    )
    return service_response


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
        version='AppsV1beta1',
    )
    kubeless_deployments = use_cases.get_kubeless_yaml()
    for deployment in kubeless_deployments:
        deployment_response = use_cases.create_deployment(
            api_instance=api_instance,
            deployment=deployment,
            namespace='kubeless'
        )

#TODO: get this working for web app scaling
def create_hpa(self, tosca_kube_obj, kube_obj_name):
    scaling_props = tosca_kube_obj.scaling_object
    hpa = None
    if scaling_props:
        min_replicas = scaling_props.min_replicas
        max_replicas = scaling_props.max_replicas
        cpu_util = scaling_props.target_cpu_utilization_percentage
        deployment_name = kube_obj_name

        # Create target Deployment object
        target = client.V1CrossVersionObjectReference(
            api_version="extensions/v1beta1",
            kind="Deployment",
            name=deployment_name)
        # Create the specification of horizon pod auto-scaling
        hpa_spec = client.V1HorizontalPodAutoscalerSpec(
            min_replicas=min_replicas,
            max_replicas=max_replicas,
            target_cpu_utilization_percentage=cpu_util,
            scale_target_ref=target)
        metadata = client.V1ObjectMeta(name=deployment_name)
        # Create Horizon Pod Auto-Scaling
        hpa = client.V1HorizontalPodAutoscaler(
            api_version="autoscaling/v1",
            kind="HorizontalPodAutoscaler",
            spec=hpa_spec,
            metadata=metadata)
    return hpa