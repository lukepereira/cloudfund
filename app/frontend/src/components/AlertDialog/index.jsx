import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

class AlertDialog extends React.Component {

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.message}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            {
              this.props.onDisagree &&
              <Button onClick={this.props.onDisagree} color="primary">
                {this.props.onDisagreeText || 'Disagree'}
              </Button>
            }
            {
              false && this.props.onAgree &&
              <Button onClick={this.props.onAgree} color="primary" autoFocus>
                {this.props.onAgreeText || 'Agree'}
              </Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default AlertDialog
