import datetime
import json
import uuid

from . import use_cases


def create_project_entity(
    project_id, 
    project_name,
    pull_request_url, 
    pull_request_sha,
    cost,
    cluster,
):
    cluster_json =  json.loads(cluster['content'])
    project_info = {
        'project_id': project_id,
        'project_name': project_name,
        'status': 'pending_payment',
        'pull_request_url': pull_request_url,
        'sha': pull_request_sha,
        'group_ids': { 'values': [] },
        'date_created': datetime.datetime.utcnow(),
        'predicted_cost': cost,
        'cumulative_cost': 0,
        'revenue': 0,
        'wallet': 0,
        'cluster_location': cluster_json['cluster']['location'],
    }
    client = use_cases.get_client()
    entity = use_cases.create_entity(client, project_id, 'Project')
    use_cases.update_entity(entity, project_info)
    client.put(entity)
    return project_id
    
    
def get_all_projects():
    client = use_cases.get_client()
    query = client.query(kind='Project')
    # query.order = ['-date_created']
    results = list(query.fetch())
    return results
    
    
def get_project(project_id):
    client = use_cases.get_client()
    # query = client.query(kind='Project')
    # query.add_filter('project_id', '=', project_id)
    # result = query.fetch()
    project = use_cases.get_entity(client, project_id, 'Project')
    return project
    
    
def update_project(project):
    client = use_cases.get_client()
    client.put(project)


def update_project_status(project_id, status):
    project = get_project(project_id)
    project['status'] = status
    update_project(project)


def get_project_cost(project_id):
    client = use_cases.get_client()
    project = use_cases.get_entity(client, project_id)
    if project and 'cost' in project.keys():
        return project.get('cost')
    return client
    
    
def create_payment_entity(
    project_id,
    amount,
    stripe_object,
    status
):
    payment_id = uuid.uuid4().hex
    payment_info = {
        'payment_id': payment_id,
        'project_id': project_id,
        'group_ids': { 'values': [] },
        'amount': amount,
        'stripe_object': stripe_object,
        'status': status, # pending_deposit, deposited, refunded
        'date_created': datetime.datetime.utcnow(),
    }
    client = use_cases.get_client()
    entity = use_cases.create_entity(client, payment_id, 'Payment')
    use_cases.update_entity(entity, payment_info)
    client.put(entity)
    return payment_id
    
    
def approve_pending_payments(project_id):
    client = use_cases.get_client()
    pending_payments = use_cases.get_project_payments(
        client, 
        project_id, 
        'pending_deposit',
    )
    for payment in pending_payments:
        payment['status'] = 'deposited'
    client.put_multi(pending_payments)
    return pending_payments


def set_project_costs(query_iterator):
    projects = {
        'to_deploy': [],
        'to_stop': [],
    }
    for row in query_iterator:
        project_id = row.value
        cost = float(row.cost)
        project = get_project(project_id)

        if not project:
            continue

        project['cumulative_cost'] = cost
        project['wallet'] = float(project['revenue']) - cost
        
        if project['wallet'] < project['predicted_cost']['hourly_cost']:
            projects['to_stop'].append(project)
            #TODO: should set status after actually stopping
            project['status'] = 'stopped'
        else:
            projects['to_deploy'].append(project)
            
        update_project(project)
    return projects
    