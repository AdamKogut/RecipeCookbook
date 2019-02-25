import React from 'react';
import './EditRecipeModal.css';

import { Modal, Paper, Button, AppBar, Tabs, Tab, TextField, Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core';
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import AlertDialog from "../AlertDialog/AlertDialog";

class RecipeModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      recipeEdit: props.recipe,
      currentTab: 0,
      closed: true,
      warningIsOpen: false
    };

    this.noChangesAlert = React.createRef();
  }

  handleTab = (event, value) => {
    this.setState({ currentTab: value });
  };

  handleClose = () => {
    // Check for unsaved notes
    if (this.props.recipe !== this.state.recipeEdit) {
      this.setState({
        warningIsOpen: true
      });

      return;
    }

    // close the modal
    this.props.onClose();
    this.setState({
      recipeEdit: {},
      currentTab: 0,
      closed: true,
      warningIsOpen: false
    });
  };

  parseInput = (inputName, text) => {
    const recipe = this.state.recipe;
    recipe.extendedIngredients = [];

    const newValue = {};
    newValue[inputName + "String"] = text;

    this.setState({
      ...this.state,
      ...newValue
    });
  };

  render () {
    const currentTab = this.state.currentTab;

    // If this has just been opened, grab the data from the server
    if (this.props.recipe && this.state.closed) {
      const recipe = this.state.recipeEdit;
      let ingredientsString = "";
      let instructionsString = "";

      for (let i = 0; i < recipe.extendedIngredients.length; i++) {
        ingredientsString += recipe.extendedIngredients[i].original + '\n';
      }

      if (recipe.instructions !== null) {
        for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
          instructionsString += recipe.analyzedInstructions[0].steps[i].step + '\n';
        }
      }

      this.setState({
        closed: false,
        recipeEdit: this.props.recipe,
        ingredientsString,
        instructionsString
      });
    }

    let content;
    if (this.state.recipeEdit.title) {
      const recipe = this.state.recipeEdit;

      const ingredients = (
        <TextField
          onChange={(event) => {
            this.parseInput("ingredients", event.target.value);
          }}
          className={'edit-recipe-modal-textarea'}
          value={this.state.ingredientsString}
          multiline
        />
      );

      const instructions = (
        <TextField
          onChange={(event) => {
            this.parseInput("instructions", event.target.value);
          }}
          className={'edit-recipe-modal-textarea'}
          value={this.state.instructionsString}
          multiline
        />
      );

      content = (
        <div>
          <h1 id={'edit-recipe-modal-title'}>
            {recipe.title}
          </h1>

          <img id={'edit-recipe-modal-image'} src={recipe.image} alt={`recipe: ${recipe.title}`} />

          <div id={"edit-recipe-modal-toolbar"}>
            <Button variant="contained" color="primary" onClick={this.saveRecipe}>
              Save
            </Button>

            <Button variant="contained">
              Cancel
            </Button>
          </div>
          <br />

          One Per Line
          <div id={'edit-recipe-modal-description'}>
            <AppBar position="static" color={'default'}>
              <Tabs value={currentTab} onChange={this.handleTab} variant={'fullWidth'}>
                <Tab label="Ingredients" />
                <Tab label="Instructions" />
              </Tabs>
            </AppBar>
            {currentTab === 0 && ingredients}
            {currentTab === 1 && instructions}
          </div>
        </div>
      );
    } else {
      content = <Loader/>
    }

    return (
      <div>
        <Modal
          open={this.props.recipe !== null}
          onClose={this.handleClose}
        >
          <Paper className={'modal-container'}>
            {content}
          </Paper>
        </Modal>

        <ConfirmationDialog
          isOpen={this.state.warningIsOpen}
          title={"Exit?"}
          text={"You have unsaved changes for this recipe. Exit anyways?"}
          agreeText={"Yes"}
          disagreeText={"No"}
          onClose={() => {
            this.setState({
              warningIsOpen: false
            });
          }}
          onAgree={() => {
            // close the modal
            this.props.onClose();
            this.setState({
              recipeEdit: {},
              currentTab: 0,
              closed: true,
              warningIsOpen: false
            });
          }}
        />

        <AlertDialog
          title={"Alert"}
          text={"There are no changes to be saved for the current recipe"}
          ref={this.noChangesAlert}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeModal);