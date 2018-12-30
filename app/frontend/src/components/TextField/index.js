import React from 'react'
import PropTypes from 'prop-types'
import {
	withStyles
} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
	dense: {
		marginTop: 19,
	},
	menu: {
		width: 200,
	},
})

class TextFields extends React.Component {
	handleChange = (event) => {
		this.props.onChange && this.props.onChange(event)
	}

	render() {
		const {
			classes
		} = this.props

		return ( 
            <form className={classes.container} noValidate autoComplete="off">
              <TextField          
                name={this.props.name}
                label={this.props.label}
                placeholder={this.props.placeholder}
				type={this.props.type}
                className={classes.textField}
                value={this.props.value}
                onChange={this.handleChange}
                margin="normal"
              />
            </form>
		)
	}
}

TextFields.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TextFields)