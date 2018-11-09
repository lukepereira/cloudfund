#https://github.com/kubernetes-client/python/tree/master/examples
import json
from os import path

from . import config 

from apiclient.discovery import build


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

def create_cluster(
    gcp_project,
    zone,
    cluster_json,
    version='v1beta1',
 ):
    service = build('container', version)
    cl = service.projects().zones().clusters()
    return cl.create(
        projectId=gcp_project,
        zone=zone,
        body=cluster_json
    ).execute()
    