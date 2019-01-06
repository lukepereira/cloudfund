import React from 'react'

import axios from 'axios'
import {
    CardElement,
    Elements,
    injectStripe,
    InjectedProps,
} from 'react-stripe-elements'
import './Payments.css'
import { formatDollar } from '../helpers'

class _CardForm extends React.Component<InjectedProps & {fontSize: string, project: object}> {

    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
        }
    }    
    
    handleAmountChange = (event) => this.setState({amount: event.target.value})
    
    createCharge = (stripeToken) => {
        if (!this.props.project) {
            return
        }
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/handle_charge'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url, 
            { 
                stripeToken: stripeToken,
                amount: this.state.amount,
                project_id: this.props.project.project_id,
            },
            config,
        )
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleSubmit = (ev) => {
        ev.preventDefault()
        if (this.state.amount < 1) {
            return
        }
        if (this.props.stripe) {
            this.props.stripe
            .createToken()
            .then((payload) => this.createCharge(payload))
        } else {
            console.log("Stripe.js hasn't loaded yet.")
        }
    }
  
    
    handleBlur = () => {
        console.log('[blur]')
    }
    handleChange = (change) => {
        console.log('[change]', change)
    }
    handleClick = () => {
        console.log('[click]')
    }
    handleFocus = () => {
        console.log('[focus]')
    }
    handleReady = () => {
        console.log('[ready]')
    }
    
    createOptions = (fontSize: string, padding: ?string) => {
        return {
            style: {
                base: {
                    fontSize,
                    color: '#424770',
                    letterSpacing: '0.025em',
                    fontFamily: 'Source Code Pro, monospace',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                    ...(padding ? { padding } : {}),
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        }
    }
  
    render() {
        return (
            <div>
                <label>
                    Amount
                    <input 
                        placeholder="0 USD" 
                        onChange={this.handleAmountChange}>
                        
                    </input>
                </label>
                
                <label>
                    Card details
                    <CardElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        hidePostalCode={true}
                        {...this.createOptions(this.props.fontSize)}
                    />
                </label>
                <button onClick={this.handleSubmit}>Pay</button>
            </div>
        )
    }
}
const CardForm = injectStripe(_CardForm)

class Payments extends React.Component<{}, {elementFontSize: string}> {
    constructor() {
        super()
        this.state = {
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
                this.setState({elementFontSize: '14px'})
            } else if (
                window.innerWidth >= 450 &&
                this.state.elementFontSize !== '18px'
            ) {
                this.setState({elementFontSize: '18px'})
            }
        })
    }

    getPaymentStatus = () => (
        this.props.project &&
        <div>
            <div>
                {`Wallet: ${formatDollar(this.props.project.wallet)}`}
            </div>
            <div>
                {`Monthly Cost: ${formatDollar(this.props.project.predicted_cost.monthly_cost)}`}
            </div>
            <div>
                {`Hourly Cost: ${formatDollar(this.props.project.predicted_cost.hourly_cost)}`}
            </div>
        </div>
    )


    render() {
        const {elementFontSize} = this.state
        return (
            <div className="Payments">
                <h1>Payments</h1>
                <div>
                    {this.getPaymentStatus()}
                </div>
                <Elements>
                    <CardForm project={this.props.project} fontSize={elementFontSize} />
                </Elements>
            </div>
        )
    }
}

export default Payments
