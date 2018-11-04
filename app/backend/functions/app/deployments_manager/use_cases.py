#https://github.com/kubernetes-client/python/tree/master/examples
import json
from os import path

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
