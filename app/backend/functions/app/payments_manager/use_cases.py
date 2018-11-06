
def get_charge_description(token, project_id):
    return 'project_id: {project_id}, livemode: {livemode}, brand: {brand}, funding: {funding}'.format(
        project_id=project_id,
        livemode=token['livemode'],
        brand=token['card']['brand'],
        funding=token['card']['funding'],
    )
    
def get_charge_amount(amount):
    return int(amount) * 100