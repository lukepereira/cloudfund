from github import Github

#TODO: move to app config
APP_URL = 'http://localhost:3000'


def create_branch(repo, project_id):
    source_branch = repo.get_branch('master')
    git_ref = repo.create_git_ref(
        ref='refs/heads/{target_branch}'.format(
            target_branch=project_id
        ), 
        sha=source_branch.commit.sha,
    )
    return git_ref
    
    
def create_file(repo, project_id, new_file, file_type):
    file_content = get_file_content(new_file)
    file_format = get_file_format(new_file)
    path = '{file_type}/{project_id}.{file_format}'.format(
        file_type=file_type,
        project_id=project_id,
        file_format=file_format,
    )
    repo.create_file(
        path=path,
        branch=project_id,
        message=get_message(project_id, file_type),
        content=file_content,
    )


def get_project_url(project_id):
    return '{app_url}/project/{project_id}'.format(
        app_url=APP_URL,
        project_id=project_id,
    )


def set_pending_status(repo, pull_request, project_id):
    sha = pull_request.head.sha
    repo.get_commit(sha=sha).create_status(
        state='pending',
        target_url='{project_url}/payments'.format(
            project_url=get_project_url(project_id)
        ),
        description='Deployment is pending payment',
        context='payments',
    )


def get_message(project_id, file_type):
    if file_type == 'title':
        return 'Cluster and deployment configurations for project {project_id}'.format(
            project_id=project_id,
        )
        
    if file_type == 'body':
        return 'View project {project_id} @ {project_url}'.format(
            project_id=project_id,
            project_url=get_project_url(project_id),
        )
    
    return 'Adding {file_type} file'.format(
        file_type=file_type,
    )


def get_file_content(content_file):
    return content_file['content']
        
        
def get_file_format(content_file):
    return content_file['format']
    
        
def get_configuration_file(repo, ref, project_id, config_type):
    file_type = get_file_type(config_type)
    configuration_file = repo.get_file_contents(
        path='/{config_type}/{project_id}.{file_type}'.format(
            config_type=config_type,
            project_id=project_id,
            file_type=file_type,
        ),
        ref=ref,
    )
    return configuration_file
    

def get_file_type(config_type):
    if config_type == 'clusters':
        return 'json'
    elif config_type == 'deployments':
        return 'yaml'
