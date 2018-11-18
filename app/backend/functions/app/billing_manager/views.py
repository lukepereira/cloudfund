from . import use_cases
from ..projects_manager.views import (
    get_project,
    update_project,
)
from ..github_manager.views import (
    approve_pending_pr,
    get_project_configuration,
)
from ..deployments_manager.views import (
    get_resources_from_cluster,
)
from ..projects_manager.views import (
    approve_pending_payments,
    create_payment_entity,
    get_project,
    update_project,
)

def predict_project_cost(
    access_token,
    repo_name,
    project_id,
):
    project = get_project(project_id)
    if not project:
        return
    if 'predicted_cost' in project.keys():
        return project.get('predicted_cost')
        
    cluster = {
        'file_type': 'json', 
        'content': get_project_configuration(
            access_token,
            repo_name,
            project.get('sha'),
            project_id,
            'clusters',
        )
    }
    predicted_cost = predict_cost_from_cluster_json(cluster)
    project['predicted_cost'] = predicted_cost
    updated_project = update_project(project)
    return cost
    
    
def predict_cost_from_cluster_json(cluster):
    resources = get_resources_from_cluster(cluster['content'])
    pricing_table = use_cases.get_pricing_table()
    cost = use_cases.get_predicted_cost(resources, pricing_table)
    return cost
    
    
def handle_monthly_payment(
    access_token,
    repo_name,
    project_id,
):
    project = get_project(project_id)
    if (project['wallet'] >= project['predicted_cost']['monthly_cost']):
        pr = approve_pending_pr(
            access_token,
            repo_name,
            project_id,
            project['sha'],
        )
        payments = approve_pending_payments(project_id)
        project['status'] = 'pending_merge'
        updated_project = update_project(project)
        return project['status']
        
        
def get_costs_from_bigquery(
    big_query_table,
):
    QUERY = '''
        SELECT
        labels.key as key,
        labels.value as value,
        SUM(cost) as cost
        FROM `{big_query_table}`
        LEFT JOIN UNNEST(labels) as labels
        WHERE key = 'project_id'
        GROUP BY key, value;
    '''.format( 
        big_query_table=big_query_table,
    )
    rows = use_cases.query_bigquery(QUERY)
    return rows
    