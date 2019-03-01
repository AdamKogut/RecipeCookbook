import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios/index";

class RecipeSubstituter extends React.Component {
  state = {
    open: false,
    substitutes: []
  };

  open = () => {
    this.setState({
      open: true
    });

    axios.get(
      'http://localhost:8080/ingredientSubstitution',
      {
        headers: {
          name: this.props.ingredientName
        }
      }
    ).then((response) => {
      this.setState({
        substitutes: response.data.body.substitutes
      });
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      substitutes: []
    });
  };

  render() {
    const substitutions = [];
    let substitutionList;

    if (!this.state.substitutes) {
      substitutions.push(
        <li key={'substitute'}>
          <em>None Found</em>
        </li>
      );
    } else {
      for (let i = 0; i < this.state.substitutes.length; i++) {
        substitutions.push(
          <li key={'substitute' + i}>
            { this.state.substitutes[i] }
          </li>
        );
      }
    }

    substitutionList = (
      <ul>
        {substitutions}
      </ul>
    );

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>
            {"Substitutes for " + this.props.ingredientName}
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              {substitutionList}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default RecipeSubstituter;