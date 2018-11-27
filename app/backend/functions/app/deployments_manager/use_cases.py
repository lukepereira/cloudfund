# https://github.com/kubernetes-client/python/tree/master/examples
# https://developers.google.com/resources/api-libraries/documentation/container/v1/python/latest/index.html
import json
from os import path
import urllib

from apiclient.discovery import build
from google.auth import compute_engine
from google.cloud.container_v1 import ClusterManagerClient
from kubernetes import client, config

from . import config 


def find_values(id, json_repr):
    results = []
    def _decode_dict(a_dict):
        try: results.append(a_dict[id])
        except KeyError: pass
        return a_dict
    json.loads(json_repr, object_hook=_decode_dict) 
    return results


def get_resources_from_node_pool(node_pool):
    return {
        field: (
            node_pool['config'].get(field, '')
            if field in node_pool['config']
            else node_pool.get(field, '')
        )
        for field in config.CLUSTER_RESOURCE_FIELDS
    }


def get_cluster(
    gcp_project,
    zone,
    cluster,
    version='v1beta1',
):
    try:
        service = build('container', version)
        cl = service.projects().zones().clusters()
        response = cl.get(
            projectId=gcp_project,
            clusterId=cluster['cluster']['name'],
            zone=zone,  
        ).execute()
        return response
    except (urllib.error.HTTPError, Exception) as err:
        return None

def create_cluster(
    gcp_project,
    zone,
    cluster,
    version='v1beta1',
):
    service = build('container', version)
    cl = service.projects().zones().clusters()
    response = cl.create(
        projectId=gcp_project,
        zone=zone,
        body=cluster
    ).execute()
    return response


def scale_cluster(
    gcp_project,
    cluster,
    size,
    version='v1beta1',
):
    service = build('container', version)
    cl = service.projects().zones().clusters()
    response = []
    for pool in cluster['nodePools']:
        body = {
            'projectId': gcp_project,
            'zone': cluster['cluster']['location'],
            'clusterId': cluster['cluster']['name'],
            'nodePoolId': pool['name'],
            'nodeCount': size,
        }
        node_pool_response = cl.setSize(
            projectId=gcp_project,
            zone=cluster['cluster']['location'],
            clusterId=cluster['cluster']['name'],
            nodePoolId=pool['name'],
            nodeCount=size,
            body=cluster,
        ).execute()
        response.append(node_pool_response)
    return response

    
def get_k8_api(
    gcp_project,
    zone,
    cluster_id,
):
    credentials = compute_engine.Credentials()
    cluster_manager_client = ClusterManagerClient(
        credentials=credentials,
    )
    cluster = cluster_manager_client.get_cluster(
        gcp_project,
        zone,
        cluster_id,
    )
    configuration = client.Configuration()
    configuration.host = "https://{endpoint}:443".format(
        endpoint=cluster.endpoint,
    )
    configuration.verify_ssl = False
    configuration.api_key = {
        'authorization': 'Bearer {token}'.format(
            token=credentials.token,
        )
    }
    # configuration.ssl_ca_cert = "/path/to/ca_chain.crt"
    client.Configuration.set_default(configuration)
    return client.ExtensionsV1beta1Api()
    

def sanitize_k8_object(k8_object):
    api = client.ApiClient()
    return api.sanitize_for_serialization(k8_object)


def create_deployment(api_instance, deployment):
    try:
        api_response = api_instance.create_namespaced_deployment(
            body=deployment,
            namespace='default',
        )
        return sanitize_k8_object(api_response)
    except (client.rest.ApiException) as error:
        api_response = update_deployment(
            api_instance, 
            deployment,
        )
        return sanitize_k8_object(api_response)


def update_deployment(api_instance, deployment):
    api_response = api_instance.patch_namespaced_deployment(
        name=deployment['metadata']['name'],
        namespace="default",
        body=deployment)
    return api_response
    
    
def delete_deployment(api_instance, deployment_name):
    api_response = api_instance.delete_namespaced_deployment(
        name=deployment_name,
        namespace="default",
        body=client.V1DeleteOptions(
            propagation_policy='Foreground',
            grace_period_seconds=5))
    return sanitize_k8_object(api_response)
