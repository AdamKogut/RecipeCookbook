import React from 'react';
import './EditRecipeModal.css';

import { Modal, Paper, Button, AppBar, Tabs, Tab, TextField, Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core';
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import AlertDialog from "../AlertDialog/AlertDialog";
import Axios from "axios/index";

class RecipeModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      recipeEdit: {},
      currentTab: 0,
      closed: true,
      warningIsOpen: false
    };

    this.noChangesAlert = React.createRef();
    this.emptyAlert = React.createRef();
  }

  handleTab = (event, value) => {
    this.setState({ currentTab: value });
  };

  handleClose = () => {
    // Check for unsaved notes
    if (JSON.stringify(this.props.recipe) !== JSON.stringify(this.state.recipeEdit)) {
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
    const recipe = this.state.recipeEdit;

    if (inputName === "ingredients") {
      let ingredientsList = text.split("\n").filter(function (el) {
        return el !== "";
      });

      for (let i = 0; i < ingredientsList.length; i++) {
        ingredientsList[i++] = {
          original: ingredientsList[i]
        };
      }

      recipe.extendedIngredients = ingredientsList;
    } else {
      //recipe.analyzedInstructions[0].steps[i].step = [];
      let instructionsList = text.split("\n").filter(function (el) {
        return el !== "";
      });

      for (let i = 0; i < instructionsList.length; i++) {
        instructionsList[i] = {
          step: instructionsList[i]
        };
      }

      recipe.analyzedInstructions[0].steps = instructionsList;
    }

    const newValue = {
      recipeEdit: recipe
    };
    newValue[inputName + "String"] = text;

    this.setState({
      ...this.state,
      ...newValue
    });
  };

  saveRecipe = () => {
    if (JSON.stringify(this.props.recipe) === JSON.stringify(this.state.recipeEdit)) {
      this.noChangesAlert.current.open();
      return;
    }

    if (this.state.recipeEdit.extendedIngredients.length === 0
      || this.state.recipeEdit.analyzedInstructions[0].steps.length === 0
      || this.state.recipeEdit.title.length === 0)
    {
      this.emptyAlert.current.open();
      return;
    }

    const fillerValues = {
      id: this.state.recipeEdit.id
    };

    if (!fillerValues.id) {
      fillerValues.id = Math.floor(Math.random() * 10000000000);
      fillerValues.nutrition = {
        nutrients: [
          {
            title: "No Nutrients Provided for Custom Recipes ):",
            percentOfDailyNeeds: "",
            amount: "",
            unit: ""
          }
        ]
      }
    }

    // Delete the recipe from the db if it exists
    Axios.post("https://nightin.xyz:8080/deleteSavedRecipe", {
      googleId: this.props.auth,
      deleteID: fillerValues.id
    }).then(()=>{

      // Now, actually save the recipe
      Axios.post("https://nightin.xyz:8080/savedRecipes", {
        googleId: this.props.auth,
        recipe: {
          ...this.state.recipeEdit,
          ...fillerValues
        }
      }).then(()=>{
        if (this.props.onSave)
          this.props.onSave();

        this.setState({
          recipeEdit: {},
          currentTab: 0,
          closed: true,
          warningIsOpen: false
        });
      });
    });
  };

  render () {
    const currentTab = this.state.currentTab;

    // If this has just been opened, initialize stuff
    if (this.props.recipe && this.state.closed) {
      const recipe = {
        ...this.props.recipe
      };

      let ingredientsString = "";
      let instructionsString = "";

      for (let i = 0; i < recipe.extendedIngredients.length; i++) {
        ingredientsString += recipe.extendedIngredients[i].original;

        if (i !== recipe.extendedIngredients.length - 1)
          ingredientsString += '\n';
      }

      if (recipe.instructions !== null) {
        for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
          instructionsString += recipe.analyzedInstructions[0].steps[i].step;

          if (i !== recipe.analyzedInstructions[0].steps.length - 1)
            instructionsString += '\n';
        }
      }

      this.setState({
        closed: false,
        recipeEdit: {
          ...this.props.recipe
        },
        ingredientsString,
        instructionsString
      });

      return null;
    }

    let content;
    if (this.props.recipe) {
      const recipe = this.state.recipeEdit;
      let image = null;

      if (recipe.image && recipe.image !== "")
        image = <img id={'edit-recipe-modal-image'} src={recipe.image} alt={"Incorrect Link Format"} />;

      const ingredients = (
        <TextField
          onChange={(event) => {
            this.parseInput("ingredients", cleanString(event.target.value));
          }}
          className={'edit-recipe-modal-textarea'}
          value={this.state.ingredientsString}
          multiline
        />
      );

      const instructions = (
        <TextField
          onChange={(event) => {
            this.parseInput("instructions", cleanString(event.target.value));
          }}
          className={'edit-recipe-modal-textarea'}
          value={this.state.instructionsString}
          multiline
        />
      );

      content = (
        <div>
          <TextField
            id={'edit-recipe-modal-title'}
            onChange={(event) => {
              this.setState({
                recipeEdit: {
                  ...this.state.recipeEdit,
                  title: cleanString(event.target.value)
                }
              });
            }}
            value={recipe.title}
            fullWidth
            label={'Recipe Title'}
          />

          <div id={"edit-recipe-modal-toolbar"}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.saveRecipe}
            >
              Save
            </Button>

            <Button
              variant="contained"
              onClick={this.handleClose}
            >
              Cancel
            </Button>
          </div>
          <br />

          {image}

          <div id={"edit-recipe-modal-link"}>
            <TextField
              onChange={(event) => {
                this.setState({
                  recipeEdit: {
                    ...this.state.recipeEdit,
                    image: event.target.value
                  }
                });
              }}
              value={recipe.image}
              fullWidth
              label={'Image Link'}
            />
          </div>

          <div id={'edit-recipe-modal-description'}>
            <em>Enter Ingredients and Instructions as one per line</em>
            <br />
            <br />

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

        <AlertDialog
          title={"Alert"}
          text={"You cannot leave a text field empty!"}
          ref={this.emptyAlert}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

function cleanString (string) {
  const cleanedString = string.replace(/[!@#$%^&*()_+\-=|\\\[\]"':;`~<>?,.☼¶§æÆ¢☺£¥₧ƒªº¿¬½¼¡«»ßµ±°∙·²€◙☻♥♦♣♠•◘○◙]/gi, '');
  return cleanedString;
}

export default connect(mapStatesToProps)(RecipeModal);