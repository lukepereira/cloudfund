import stripe

from . import use_cases
from ..projects_manager.views import (
    create_payment_entity,
    get_project,
    update_project,
)

def create_charge(stripe_key, token, amount, project_id):
    stripe.api_key = stripe_key
    project = get_project(project_id)
    if not project:
        return

    charge = stripe.Charge.create(
        amount=use_cases.get_charge_amount(amount),
        currency='usd',
        description=use_cases.get_charge_description(token, project_id),
        source=token['id'],
        # receipt_email=''
    )
    if 'amount' not in charge:
        return

    payment_id = create_payment_entity(
        project_id,
        amount,
        charge,
        'pending_deposit'
    )
    project['revenue'] = float(project['revenue']) + float(amount)
    project['wallet'] = project['revenue'] - float(project['cumulative_cost'])
    updated_project = update_project(project)
    return charge
