import base64
import json

from github import Github

from . import use_cases


def create_project_pull_request(
    access_token,
    repo_name,
    project_id,
    project_name,
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

    valid_cluster = validate_cluster(project_id, cluster)
    cluster_file = use_cases.create_file(
        repo,
        project_id,
        valid_cluster,
        'clusters',
    )
    pull_request = repo.create_pull(
        title=use_cases.get_message(project_name, 'title'),
        head=branch.ref,
        base='master',
        body=use_cases.get_message(project_id, 'body'),
    )
    use_cases.set_status(repo, pull_request.head.sha, project_id, 'pending')
    return { 
        'url': pull_request.html_url,
        'sha': pull_request.head.sha,
    }


def validate_cluster(project_id, cluster):
    cluster_json = json.loads(cluster['content'])
    
    if 'resourceLabels' not in cluster_json['cluster']:
        cluster_json['cluster']['resourceLabels'] = {}
    cluster_json['cluster']['resourceLabels']['project_id'] = project_id
    
    for pool in cluster_json['cluster']['nodePools']:
        if 'labels' not in pool['config']:
            pool['config']['labels'] = {}
        pool['config']['labels']['project_id'] = project_id
    
    cluster_json['cluster']['name'] = 'cluster-{project_id}'.format(
        project_id=project_id
    )
    
    cluster['content'] = json.dumps(cluster_json, indent=4)
    return cluster    

    
def get_project_configuration(
    access_token,
    repo_name,
    ref,
    project_id,
    config_type,
):
    g = Github(access_token)
    repo = g.get_repo(repo_name)
    print (access_token, repo_name, repo)
    configuration_file = use_cases.get_configuration_file(
        repo,
        ref,
        project_id,
        config_type,
    )
    return base64.b64decode(configuration_file.content)


def approve_pending_pr(
    access_token,
    repo_name,
    project_id,
    sha,
):
    g = Github(access_token)
    repo = g.get_repo(repo_name)
    use_cases.set_status(repo, sha, project_id, 'success')
    return sha
    