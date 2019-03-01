import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ConfirmationDialog extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          open={this.props.isOpen}
          onClose={this.props.onClose}
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.props.title}
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.props.text}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              {this.props.disagreeText}
            </Button>
            <Button onClick={this.props.onAgree} color="primary">
              {this.props.agreeText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ConfirmationDialog;