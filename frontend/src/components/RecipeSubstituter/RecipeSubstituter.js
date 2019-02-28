import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class RecipeSubstituter extends React.Component {
  state = {
    open: false,
    substitutes: []
  };

  open = () => {
    this.setState({
      open: true
    });

    // Grab the data from the api
    this.setState({
      substitutes: [
        "1 cup = 7/8 cup shortening and 1/2 tsp salt",
        "1/2 cup = 1/4 cup buttermilk + 1/4 cup unsweetened applesauce",
        "1 cup = 7/8 cup vegetable oil + 1/2 tsp salt",
        "1 cup = 1 cup margarine"
      ]
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
    let substitutionList = null;

    if (this.state.substitutes.length === 0) {
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