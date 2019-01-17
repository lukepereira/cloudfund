from decimal import *


def get_charge_description(token, project_id):
    return 'project_id: {project_id}, livemode: {livemode}, brand: {brand}, funding: {funding}'.format(
        project_id=project_id,
        livemode=token['livemode'],
        brand=token['card']['brand'],
        funding=token['card']['funding'],
    )


def get_charge_amount(amount):
    TWOPLACES = Decimal(10) ** -2
    
    amount_with_fees = apply_stripe_fee(amount)
    rounded_decimal = Decimal(amount_with_fees).quantize(TWOPLACES)
    return str(int(rounded_decimal * 100))


#https://support.stripe.com/questions/charging-stripe-fees-to-customers
def apply_stripe_fee(amount):
    return (int(amount) + 0.3)  / (1 - 0.029)