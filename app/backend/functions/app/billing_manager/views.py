from . import use_cases
from ..projects_manager.views import (
    get_project,
    update_project,
)
from ..github_manager.views import (
    get_project_configuration,
)
from ..deployments_manager.views import (
    get_resources_from_cluster,
)

def predict_cost_from_cluster(
    access_token,
    repo_name,
    project_id,
):
    project = get_project(project_id)
    if not project:
        return
    if 'cost' in project.keys():
        return project.get('cost')
        
    cluster = get_project_configuration(
        access_token,
        repo_name,
        project.get('sha'),
        project_id,
        'clusters',
    )
    resources = get_resources_from_cluster(cluster)
    pricing_table = use_cases.get_pricing_table()
    cost = use_cases.get_predicted_cost(resources, pricing_table)
    print (cost)
    project['cost'] = cost
    updated_project = update_project(project)
    print (updated_project)
    return cost
    