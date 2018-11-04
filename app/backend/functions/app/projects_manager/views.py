import datetime

from . import use_cases


def create_project_entity(
    project_id, 
    project_name,
    project_url,
    pull_request_url, 
    pull_request_sha,
):
    project_info = {
        'project_id': project_id,
        'project_name': project_name,
        'project_url': project_url,
        'status': 'pending_payment',
        'pull_request_url': pull_request_url,
        'sha': pull_request_sha,
        'group_ids': { 'values': [] },
        'date_created': datetime.datetime.utcnow(),
    }
    client = use_cases.get_client()
    entity = use_cases.create_entity(client, project_id)
    use_cases.update_entity(entity, project_info)
    client.put(entity)
    return project_id
    
    
def get_all_projects():
    client = use_cases.get_client()
    query = client.query(kind='Project')
    query.order = ['-date_created']
    results = list(query.fetch())
    return results
    
    
def get_project(project_id):
    client = use_cases.get_client()
    # query = client.query(kind='Project')
    # query.add_filter('project_id', '=', project_id)
    # result = query.fetch()
    project = use_cases.get_project(client, project_id)
    return project
    
    
def update_project(project):
    client = use_cases.get_client()
    client.put(project)


def get_project_cost(project_id):
    client = use_cases.get_client()
    project = use_cases.get_project(client, project_id)
    if project and 'cost' in project.keys():
        return project.get('cost')
    return client
        