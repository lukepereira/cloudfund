import React, { Component } from "react";
import { StripeProvider } from 'react-stripe-elements'
import Payments from '../Payments'

class StripeWrapper extends Component {
    render() {
        const apiKeyConfig = {
            'dev': 'pk_test_ciksUuHEGnKcHgQVZOYLI6Uu',
        }
        
        return (
            <StripeProvider apiKey={apiKeyConfig.dev}> 
                <Payments {...this.props}/>
            </StripeProvider> 
        )
    }    
}

export default StripeWrapper