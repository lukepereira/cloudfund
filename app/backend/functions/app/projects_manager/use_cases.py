import json
import uuid

from google.cloud import datastore


def get_client():
    return datastore.Client()

    
def create_entity(client, key_id, kind):
    key = client.key(kind, key_id)
    entity = datastore.Entity(key=key)
    return entity


def update_entity(entity, data):
    return entity.update(data)
    
    
def query_entities(client, type, query):
    results = list(query.fetch())
    return results
    
def get_entity(client, key_id, kind):
    key = client.key(kind, key_id)
    entity = client.get(key)
    return entity
    

def get_project_payments(client, project_id, status):
    query = client.query(kind='Payment')
    query.add_filter('project_id', '=', project_id)
    query.add_filter('status', '=', status)
    return list(query.fetch())
