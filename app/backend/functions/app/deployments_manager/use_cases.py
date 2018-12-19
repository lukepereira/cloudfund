# https://github.com/kubernetes-client/python/tree/master/examples
# https://github.com/kubernetes-client/python/blob/master/kubernetes/docs
# https://developers.google.com/resources/api-libraries/documentation/container/v1/python/latest/index.html

import json
from os import path
import urllib
import yaml

from apiclient.discovery import build
from google.auth import compute_engine
from google.cloud.container_v1 import ClusterManagerClient
from kubernetes import client, config
import requests

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
        body=cluster,
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
    cluster_response = {}
    
    cluster = get_cluster(
        gcp_project=gcp_project,
        zone=cluster['cluster']['location'],
        cluster_id=cluster['cluster']['name'],
    )
    if cluster:
        cluster_response = cl.delete(
            projectId=gcp_project,
            clusterId=cluster['cluster']['name'],
            zone=cluster['cluster']['location'],
        ).execute()
    # print(cluster_response)
    ## unresolved bug in GKE prevents scaling nodepools to 0
    ## https://stackoverflow.com/questions/44525692/google-cloud-deployment-manager-update-container-cluster
    
    # for pool in cluster['cluster']['nodePools']:
    #     body = {
    #         'projectId': gcp_project,
    #         'zone': cluster['cluster']['location'],
    #         'clusterId': cluster['cluster']['name'],
    #         'nodePoolId': pool['name'],
    #         'nodeCount': size,
    #     }
    #     
    #     node_pool_response = cl.setSize(
    #         projectId=gcp_project,
    #         zone=cluster['cluster']['location'],
    #         clusterId=cluster['cluster']['name'],
    #         nodePoolId=pool['name'],
    #         body=cluster,
    #     ).execute()
    #     response.append(node_pool_response)
    #    node_pool_response = cl.delete(
    #        projectId=gcp_project,
    #        clusterId=cluster['cluster']['name'],
    #        zone=cluster['cluster']['location'],
    #        nodePoolId=pool['name'],
    #    ).execute()
    #    response.append(node_pool_response)
    return cluster_response


def get_k8_api(
    gcp_project,
    zone,
    cluster_id,
    client_version='ExtensionsV1beta1Api'
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
    if client_version == 'CoreV1Api':
        return client.CoreV1Api()
    if client_version == 'AppsV1beta1':
        return client.AppsV1beta1()
    if client_version == 'ExtensionsV1beta1Api':
        return client.ExtensionsV1beta1Api()

def sanitize_k8_object(k8_object):
    api = client.ApiClient()
    return api.sanitize_for_serialization(k8_object)


def create_deployment(api_instance, deployment, namespace='default'):
    try:
        api_response = api_instance.create_namespaced_deployment(
            body=deployment,
            namespace=namespace,
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


def get_kubeless_yaml():
    release = requests.get('https://api.github.com/repos/kubeless/kubeless/releases/latest')
    release_json = release.json()
    release_version = release_json['tag_name']
    kubeless_deployment_url = 'https://github.com/kubeless/kubeless/releases/download/{release_version}/kubeless-{release_version}.yaml'.format(
        release_version=release_version,
    )
    kubeless_deployment = requests.get(kubeless_deployment_url)
    deployments_generator = yaml.load_all(kubeless_deployment.text)
    return deployments_generator
    
    
#TODO: add project_id label
def create_service(
    api_instance,
    service,
    namespace='default',
    # port=8080,
    # target_port=8080,
):
    # service = client.V1Service()
    # service.api_version = "v1"
    # service.kind = "Service"
    # service.metadata = client.V1ObjectMeta(name=name)
    # spec = client.V1ServiceSpec(type="LoadBalancer")
    # spec.selector = {"app.kubernetes.io/name": "hello-world"}
    # spec.ports = [client.V1ServicePort(port=port, target_port=target_port)]
    # service.spec = spec
    api_response = api_instance.create_namespaced_service(namespace=namespace, body=service)
    return api_response
    