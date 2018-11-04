from . import use_cases


def get_resources_from_cluster(cluster_json):
    resource_data = []
    location = use_cases.find_values('location', cluster_json)[0]
    node_pool = use_cases.find_values('nodePools', cluster_json)[0]
    for pool in node_pool:
        pool_resource_data = use_cases.get_resources_from_node_pool(pool)
        pool_resource_data['location'] = location
        resource_data.append(pool_resource_data)
    return resource_data
    