#https://github.com/kubernetes-client/python/tree/master/examples
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
    # request = service.projects().zones().clusters().setMasterAuth(
    #     projectId=gcp_project,
    #     zone=zone,
    #     clusterId=cluster_id,
    #     body=set_master_auth_request_body
    # )
    
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
    # configuration.ssl_ca_cert = "/path/to/ca_chain.crt"
    configuration.api_key = {
        'authorization': 'Bearer {token}'.format(
            token=credentials.token,
        )
    }
    client.Configuration.set_default(configuration)
    print(credentials.token)
    print (cluster.endpoint)
    return client.ExtensionsV1beta1Api() # CoreV1Api
        
        
def create_deployment(api_instance, deployment):
    api_response = api_instance.create_namespaced_deployment(
        body=deployment,
        namespace='default',
    )
    return api_response
