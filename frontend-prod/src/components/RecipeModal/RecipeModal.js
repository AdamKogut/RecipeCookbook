import React from "react";
import "./RecipeModal.css";

import {
  Modal,
  Paper,
  Button,
  AppBar,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from "@material-ui/core";
import Loader from "../Loader/Loader";
import axios from "axios/index";
import RecipeToolbar from "./RecipeToolbar";
import { connect } from "react-redux";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import AlertDialog from "../AlertDialog/AlertDialog";
import RecipeSubstituter from "../RecipeSubstituter/RecipeSubstituter";
import Rating from "react-rating";
import { StarBorder, Star } from "@material-ui/icons";

class RecipeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: {},
      currentTab: 0,
      closed: true,
      notes: "",
      notesOriginal: "",
      notesWarningIsOpen: false,
      substituteName: "",
    };

    this.noChangesAlert = React.createRef();
    this.notesAlert = React.createRef();
    this.recipeSubstituter = React.createRef();
  }

  getData = () => {
    if (this.props.type === "saved") {
      // Grab the saved list and extract out the necessary data
      axios
        .get("https://nightin.xyz/savedRecipes", {
          headers: {
            googleId: this.props.auth
          }
        })
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            const recipe = response.data[i];
            if (recipe.id === this.props.id) {
              this.setState({
                recipe
              });

              break;
            }
          }
        });

      // Grab the recipe notes if on the saved page
      axios
        .get("https://nightin.xyz/recipeNote", {
          headers: {
            googleId: this.props.auth
          }
        })
        .then(response => {
          let note = "";
          const notes = response.data[0].notes;
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].recipeId === this.props.id) {
              note = notes[i].note;
              break;
            }
          }

          this.setState({
            notes: note,
            notesOriginal: note
          });
        });
    } else {
      // Grab the recipe data from the api using props.id
      axios
        .get("https://nightin.xyz/recipeInfo", {
          headers: {
            id: this.props.id,
            includeNutrition: "true"
          }
        })
        .then(response => {
          this.setState({
            recipe: response.data.body
          });
        });
    }
  };

  handleTab = (event, value) => {
    this.setState({ currentTab: value });
  };

  handleClose = () => {
    // Check for unsaved notes
    if (
      this.props.type === "saved" &&
      this.state.notes !== this.state.notesOriginal
    ) {
      this.setState({
        notesWarningIsOpen: true
      });

      return;
    }

    // close the modal
    this.props.onClose();
    this.setState({
      recipe: {},
      currentTab: 0,
      closed: true,
      notes: "",
      notesOriginal: "",
      notesWarningIsOpen: false
    });
  };

  saveNotes = () => {
    if (this.state.notes === this.state.notesOriginal) {
      this.noChangesAlert.current.open();
      return;
    }

    this.setState({
      notesOriginal: this.state.notes
    });

    axios
      .post("https://nightin.xyz/recipeNote", {
        googleId: this.props.auth,
        recipeId: this.props.id,
        note: this.state.notes
      })
      .then(response => {
        this.notesAlert.current.open();
      });
  };

  getSubstitute = substituteName => {
    this.setState({
      substituteName
    });

    this.recipeSubstituter.current.open();
  };

  displayMultipliedRecipe = recipe => {
    this.setState({
      recipe
    });
  };

  newRating = value => {
    let that = this;

    axios
      .post("https://nightin.xyz/ratings", {
        googleId: that.props.auth,
        recipeId: that.props.id,
        rating: value
      })
      .then(response => {
        if (response.data.success) {
          alert("Rating updated successfully!");
          that.setState({
            recipe: { ...that.state.recipe, rating: value }
          });
        } else {
          alert("Something went wrong, please try again");
        }
      });
  };

  render() {
    const currentTab = this.state.currentTab;

    // If this has just been opened, grab the data from the server
    if (this.props.id && this.state.closed) {
      this.setState({ closed: false });
      this.getData();
    }

    let content;
    if (this.state.recipe.title) {
      const recipe = this.state.recipe;
      const ingredients = [];
      const instructions = [];
      const nutrition = [];
      let image = null;

      if (recipe.image && recipe.image !== "")
        image = (
          <img
            id={"recipe-modal-image"}
            src={recipe.image}
            alt={"Incorrect Link Format"}
          />
        );

      const ingredientNotification =
        this.state.recipe.multipliedBy && this.state.recipe.multipliedBy !== 1
          ? <span>
              <em>
                Ingredients Displayed for {this.state.recipe.multipliedBy}{" "}
                Servings
              </em>
            </span>
          : null;

      for (let i = 0; i < recipe.extendedIngredients.length; i++) {
        ingredients.push(
          <li key={"ingredient" + i}>
            <span
              className={"recipe-modal-ingredient"}
              onClick={() => {
                if (recipe.extendedIngredients[i].name)
                  this.getSubstitute(recipe.extendedIngredients[i].name);
                else this.getSubstitute(recipe.extendedIngredients[i].original);
              }}
            >
              {recipe.extendedIngredients[i].original}
            </span>
          </li>
        );
      }

      if (recipe.instructions === null) {
        instructions.push(
          <li key={"ingredient"}>
            <em>None provided ):</em>
          </li>
        );
      } else {
        for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
          instructions.push(
            <li key={"ingredient" + i}>
              {recipe.analyzedInstructions[0].steps[i].step}
            </li>
          );
        }
      }

      const nutrients = recipe.nutrition.nutrients;
      for (let i = 0; i < nutrients.length; i++) {
        nutrition.push({
          ...nutrients[i],
          key: "nutrient" + i
        });
      }

      const nutrientsTable = (
        <div>
          <span>
            <em>Nutrients Displayed for One Serving</em>
          </span>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Daily Percent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nutrition.map(row =>
                <TableRow key={row.key}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="left">
                    {row.amount + row.unit}
                  </TableCell>
                  <TableCell align="left">
                    {row.percentOfDailyNeeds}%
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      );

      const notesTab =
        this.props.type === "saved" ? <Tab label="Notes" /> : null;
      const notesBox = (
        <TextField
          label="Notes"
          value={this.state.notes}
          multiline
          rows="10"
          margin="normal"
          variant="outlined"
          fullWidth
          onChange={event => {
            this.setState({
              notes: event.target.value
            });
          }}
        />
      );

      content = (
        <div>
          <h1 id={"recipe-modal-title"}>
            {recipe.title}
          </h1>
          {this.props.type == "saved" || this.props.type == "Planning"
            ? <div style={{ position: "relative", left: "40px", top: "-20px" }}>
                <Rating
                  emptySymbol={<StarBorder />}
                  fullSymbol={<Star />}
                  initialRating={
                    this.state.recipe.rating != null
                      ? this.state.recipe.rating
                      : 0
                  }
                  onChange={this.newRating}
                />
              </div>
            : null}
          <div>
            {image}
          </div>

          <RecipeToolbar
            date={this.props.date}
            meal={this.props.meal}
            id={this.props.id}
            recipe={recipe}
            type={this.props.type}
            saveNote={this.saveNotes}
            onSave={() => {
              if (this.props.type === "saved") this.props.updateSavedList();
            }}
            onDelete={() => {
              if (this.props.type === "saved") this.props.updateSavedList();
            }}
            handleClose={this.handleClose}
            onSaveEdit={() => {
              this.getData();
              this.props.updateSavedList();
            }}
            displayMultipliedRecipe={this.displayMultipliedRecipe}
          />

          <div id={"recipe-modal-description"}>
            <AppBar position="static" color={"default"}>
              <Tabs
                value={currentTab}
                onChange={this.handleTab}
                variant={"fullWidth"}
              >
                <Tab label="Ingredients" />
                <Tab label="Instructions" />
                <Tab label="Nutrition" />
                {notesTab}
              </Tabs>
            </AppBar>
            {currentTab === 0 &&
              <div className={"recipe-modal-tab-content"}>
                {ingredientNotification}
                <ul>
                  {ingredients}
                </ul>
              </div>}
            {currentTab === 1 &&
              <div className={"recipe-modal-tab-content"}>
                <ol>
                  {instructions}
                </ol>
              </div>}
            {currentTab === 2 &&
              <div className={"recipe-modal-tab-content"}>
                {nutrientsTable}
              </div>}
            {currentTab === 3 &&
              <div className={"recipe-modal-tab-content"}>
                {notesBox}
              </div>}
          </div>
        </div>
      );
    } else {
      content = <Loader />;
    }

    return (
      <div>
        <Modal open={this.props.id !== null} onClose={this.handleClose}>
          <Paper className={"modal-container"}>
            {content}
          </Paper>
        </Modal>

        <ConfirmationDialog
          isOpen={this.state.notesWarningIsOpen}
          title={"Exit?"}
          text={"You have an unsaved note for this recipe. Exit anyways?"}
          agreeText={"Yes"}
          disagreeText={"No"}
          onClose={() => {
            this.setState({
              notesWarningIsOpen: false
            });
          }}
          onAgree={() => {
            // close the modal
            this.props.onClose();
            this.setState({
              recipe: {},
              currentTab: 0,
              closed: true,
              notes: "",
              notesOriginal: "",
              notesWarningIsOpen: false
            });
          }}
        />

        <AlertDialog
          title={"Alert"}
          text={"There are no changes to be saved for the current note"}
          ref={this.noChangesAlert}
        />

        <AlertDialog
          title={"Success"}
          text={"Notes saved for " + this.state.recipe.title}
          ref={this.notesAlert}
        />

        <RecipeSubstituter
          ingredientName={this.state.substituteName}
          onClose={() => {
            this.setState({
              substituteName: ""
            });
          }}
          ref={this.recipeSubstituter}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeModal);
