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
    if 'cost' in project.keys():
        return project.get('cost')
        
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
    cost = predict_cost_from_cluster_json(cluster)
    project['cost'] = cost
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
    if (project['wallet'] >= project['cost']['monthly_cost']):
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
    