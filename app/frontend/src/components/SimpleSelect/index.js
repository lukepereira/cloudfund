import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    border: 'none',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SimpleSelect extends React.Component {
  state = {
    [this.props.name]: '',
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl 
            required={this.props.required} 
            className={classes.formControl}>
            {
                this.props.inputLabel &&
                <InputLabel>{this.props.inputLabel}</InputLabel>
            }
          <Select
            value={this.state[this.props.name]}
            onChange={this.handleChange}
            name={this.props.name}
            className={classes.selectEmpty}
          >
            {
                this.props.options.map((option)=> (
                    <MenuItem 
                        key={option.val}
                        value={option.val}> 
                        {option.label} 
                    </MenuItem>
                ))
            }
          </Select>
          {
              this.props.placeholder &&
              <FormHelperText>{this.props.placeholder}</FormHelperText>
          }
        </FormControl>
      </form>
    );
  }
}

SimpleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSelect);