from google.cloud import bigquery
import os
import pickle

from bs4 import BeautifulSoup

from . import constants


def get_predicted_cost(resources, pricing_table):    
    # [{'name': 'pool-1', 'machineType': 'n1-standard-1', 'diskSizeGb': 30, 
    # 'imageType': 'UBUNTU', 'diskType': 'pd-standard', 'minCpuPlatform': 'Intel Skylake',
    # 'initialNodeCount': 3, 'autoscaling': {'enabled': True, 'minNodeCount': 1, 'maxNodeCount': 10}, 'location': 'us-central1-a'}]
    hourly_total = 0
    monthly_total = 0 
    
    for node_pool in resources:
        node_count = node_pool['initialNodeCount']

        if get_location_type(node_pool) == constants.LOCATION_TYPES['REGIONAL']:
            node_count = node_count * 3

        if (node_pool['autoscaling'] and node_pool['autoscaling']['enabled']):
            node_count = node_pool['autoscaling']['maxNodeCount']
        pricing_ref = parse_price_sections(node_pool, pricing_table)
        hourly_price = float(pricing_ref['hourly-price'][1:])
        monthly_price = float(pricing_ref['monthly-price'][1:])
        hourly_total += node_count * hourly_price
        monthly_total += node_count * monthly_price
        
    return {
        'hourly_cost': hourly_total, 
        'monthly_cost': monthly_total,
    } 

def get_location_type(node_pool):
    location = node_pool['location']
    if len(location.split('-')) == 2:
        return constants.LOCATION_TYPES['REGIONAL']
    else:
        return constants.LOCATION_TYPES['ZONAL']
    

def parse_price_sections(resources, pricing_table):
    price_ref = {}
    region_acronym = get_region_acronym(resources['location'])
    monthly_key = '{region_acronym}-monthly'.format(
        region_acronym=region_acronym,
    )
    hourly_key = '{region_acronym}-hourly'.format(
        region_acronym=region_acronym,
    )
    machine_type_section = get_pricing_section(
        resources['machineType'],
        pricing_table,
    )
    machine_type_header = ['Memory', 'Price (USD)', 'Preemptible price (USD)']
    if len(machine_type_section) > 3:
        machine_type_header = ['Virtual CPUs', 'Memory', 'Price (USD)', 'Preemptible price (USD)']

    zip_section_content = zip(
        machine_type_header,
        machine_type_section,
    )
    for section_type, section_content in zip_section_content:
        print(section_type, section_content)
        if section_type == 'Price (USD)':
            price_ref['monthly-price'] = section_content[monthly_key]
            price_ref['hourly-price'] = section_content[hourly_key]
        elif section_type == 'Preemptible price (USD)':
            price_ref['monthly-preemptible-price'] = section_content[monthly_key]
            price_ref['hourly-preemptible-price'] = section_content[hourly_key]
    return price_ref


def get_region_acronym(location):
    location_split = location.split('-')
    if (len(location_split) == 3):
        return constants.REGION_LOCATION_TO_ACRONYM['{}-{}'.format(
            location_split[0],
            location_split[1],
        )]
    return constants.REGION_LOCATION_TO_ACRONYM[location]


def get_pricing_section(section_header, pricing_table=None):
    found_data = []
    if not pricing_table:
        pricing_table = get_pricing_table()
    for section in pricing_table:
        if section['header'] == section_header:
            found_data.append(section['body'])
    return found_data


def get_pricing_table(src='pickle'):
    cur_path = os.path.dirname(os.path.abspath(__file__))
    file_name = 'pricing.pkl'
    file_path = '{cur_path}/{file_name}'.format(
        cur_path=cur_path,
        file_name=file_name,
    )
    pkl_file = open(file_path, 'rb')
    return pickle.load(pkl_file)

    
def create_pricing_pickle(pricing_table):
    output = open('pricing.pkl', 'wb')
    pickle.dump(pricing_table, output)
    output.close()


def get_pricing_table_from_html():
    pricing_table = []
    cur_path = os.path.dirname(os.path.abspath(__file__))
    file_name = 'pricing.html'
    file_path = '{cur_path}/{file_name}'.format(
        cur_path=cur_path,
        file_name=file_name,
    )
    soup = BeautifulSoup(open(file_path), 'html.parser')
    for section in soup.find_all('td', {'region' : 'ctrl.region'}):
        pricing_section = {}
        pricing_section['header'] = section.parent.find('td').text
        pricing_section['body'] = section.attrs
        pricing_table.append(pricing_section)
    return pricing_table


def query_bigquery(query):
    client = bigquery.Client()
    query_job = client.query(query)  
    rows = query_job.result()
    return rows
