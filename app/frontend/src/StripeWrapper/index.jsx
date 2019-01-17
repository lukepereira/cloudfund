import React, { Component } from "react";
import { StripeProvider } from 'react-stripe-elements'
import Payments from '../Payments'

class StripeWrapper extends Component {
    render() {
        const apiKeyConfig = {
            'prod': 'pk_live_FUy9Cf3yr1pWCDqAmeQRbJg1',
        }
        
        return (
            <StripeProvider apiKey={apiKeyConfig.prod}> 
                <Payments {...this.props}/>
            </StripeProvider> 
        )
    }    
}

export default StripeWrapper