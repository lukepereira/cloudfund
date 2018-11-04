import base64

from github import Github

from . import use_cases


def create_project_pull_request(
    access_token,
    repo_name,
    project_id,
    cluster,
    deployment,
):
    g = Github(access_token)
    repo = g.get_repo(repo_name)
    branch = use_cases.create_branch(repo, project_id)
    deployment_file = use_cases.create_file(
        repo, 
        project_id, 
        deployment, 
        'deployments',
    )
    cluster_file = use_cases.create_file(
        repo,
        project_id,
        cluster,
        'clusters',
    )
    pull_request = repo.create_pull(
        title=use_cases.get_message(project_id, 'title'),
        head=branch.ref,
        base='master',
        body=use_cases.get_message(project_id, 'body'),
    )
    use_cases.set_pending_status(repo, pull_request, project_id)
    return { 
        'url': pull_request.url,
        'sha': branch.ref,
    }
    
    
def get_project_configuration(
    access_token,
    repo_name,
    ref,
    project_id,
    config_type,
):
    g = Github(access_token)
    repo = g.get_repo(repo_name)
    configuration_file = use_cases.get_configuration_file(
        repo,
        ref,
        project_id,
        config_type,
    )
    return base64.b64decode(configuration_file.content)
    