import React from 'react'
import { connect } from 'react-redux'
import {
    CardElement,
    Elements,
    injectStripe,
    InjectedProps,
} from 'react-stripe-elements'
import { createProjectCharge } from '../actions/paymentActions'
import { formatDollar } from '../helpers'
import TextField from '../components/TextField'
import AlertDialog from '../components/AlertDialog'

import './Payments.css'


class _CardForm extends React.Component<InjectedProps & {fontSize: string, project: object}> {

    constructor(props) {
        super(props)
        this.state = {
            amount: '1',
            stripeFee: '0',
            total: '0',
            alertDialogIsOpen: false,
        }
    }

    handleAmountChange = (event) => this.setState({amount: event.target.value})

    createCharge = (stripeToken) => {
        if (!this.props.project) {
            return
        }

        const postBody = {
            stripeToken: stripeToken,
            amount: this.state.amount,
            project_id: this.props.project.project_id,
        }

        this.props.createProjectCharge(postBody)
    }

    handleSubmit = (ev) => {
        ev.preventDefault()
        if (this.state.amount < 1) {
            return
        }
        this.setState({alertDialogIsOpen: false})
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
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    color: '#6b7c93',
                    fontWeight: 300,
                    letterSpacing: '0.025em',
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

    handleInputChange = (targetName, targetValue) => this.setState({[targetName]: targetValue})

    applyStripeProcessingFee = (amount) => (amount + 0.3) / (1 - 0.029)

    getTotalAmountContainer = () => {
        const round = (num) => Math.round(num * 100) / 100
        const amount = parseFloat(this.state.amount)
        const totalWithStripeFee = round(this.applyStripeProcessingFee(amount))
        const stripeFee = totalWithStripeFee - amount

        return (
            <div className={'flexField'}>
                <div className={'flexFieldColumn'}>
                    <TextField
                        error={amount < 0}
                        name={'amount'}
                        label={'Donation'}
                        placeholder={''}
                        type={'number'}
                        value={amount}
                        onChange={(event) => this.handleInputChange(event.target.name, event.target.value)}
                        inputProps={{min: 0}}
                    />
                </div>
                <div className={'flexFieldColumn'} >
                    <TextField
                        disabled
                        name={'stripeFee'}
                        label={'Stripe Fees'}
                        placeholder={''}
                        helperText={''} //{'https://support.stripe.com/questions/charging-stripe-fees-to-customers'}
                        type={'number'}
                        value={stripeFee}
                    />
                </div>
                <div className={'flexFieldColumn'}>
                    <TextField
                        disabled
                        name={'total'}
                        label={'Total Amount'}
                        placeholder={''}
                        type={'number'}
                        value={totalWithStripeFee}
                    />
                </div>
            </div>
        )
    }

    openAlert = () => {
        if (this.state.amount > 0) {
            this.setState({alertDialogIsOpen: true})
        }
    }

    render() {
        return (
            <div>
                {this.getTotalAmountContainer()}
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
                <button onClick={this.openAlert}> Pay </button>
                <AlertDialog
                    title={'Are you sure?'}
                    message={[
                        'Cloudfound is still in its beta version and things may break or drasitcally change during development.',
                        ' There is no guarantee your deployment will work as expected.',
                        ' If you encounter any issues, please open an ',
                        <a target="_blank" href='https://github.com/lukepereira/cloudfound/issues'>issue</a>,
                        ' on Github or help contribute a fix.'
                    ]}
                    open={this.state.alertDialogIsOpen}
                    onAgree={this.handleSubmit}
                    onDisagree={() => this.setState({alertDialogIsOpen: false})}
                />
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
        <div className={'paymentStatusContainer'}>
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
                <div className={'subContainer'}>
                    {this.getPaymentStatus()}
                </div>
                <div>
                    <Elements>
                        <CardForm project={this.props.project} fontSize={elementFontSize} createProjectCharge={this.props.createProjectCharge} />
                    </Elements>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ })

const mapDispatchToProps = dispatch => ({
    createProjectCharge: (postBody) => dispatch(createProjectCharge(postBody)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Payments)
