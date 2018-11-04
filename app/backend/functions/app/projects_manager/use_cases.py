import json
import uuid

from google.cloud import datastore


def get_client():
    return datastore.Client()

    
def create_entity(client, project_id):
    key = client.key('Project', project_id)
    entity = datastore.Entity(key=key)
    return entity


def update_entity(entity, data):
    return entity.update(data)
    
    
def query_entities(client, type, query):
    results = list(query.fetch())
    return results
    
def get_project(client, project_id):
    key = client.key('Project', project_id)
    project = client.get(key)
    return project
    
