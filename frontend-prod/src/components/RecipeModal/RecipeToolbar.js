import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import RecipePrinter from "../RecipePrinter/RecipePrinter";
import { connect } from "react-redux";
import PlanningModal from "./PlanningModal";
import "./RecipeModal.css";
import Axios from "axios";
import AlertDialog from "../AlertDialog/AlertDialog";
import EditRecipeModal from "../EditRecipeModal/EditRecipeModal";

class RecipeToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: false,
      q: false,
      p: false,
      modal: false,
      displayingEditModal: false,
      quantity: 1
    };
    this.groceryListAlert = React.createRef();
    this.saveSuccessAlert = React.createRef();
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  saveRecipe = () => {
    let that = this;
    Axios.post("https://nightin.xyz/savedRecipes", {
      googleId: that.props.auth,
      recipe: that.props.recipe
    }).then(() => {
      that.setState({ p: !that.state.p });
      this.saveSuccessAlert.current.open();

      if (this.props.onSave) this.props.onSave();
      that.props.handleClose();
    });
  };

  removeRecipe = () => {
    let that = this;
    Axios.post("https://nightin.xyz/deleteSavedRecipe", {
      googleId: that.props.auth,
      deleteID: that.props.recipe.id
    }).then(() => {
      that.setState({ p: !that.state.p });

      if (this.props.onDelete) this.props.onDelete();
    });
  };

  addToGrocery = () => {
    const ingredientList = [];
    const recipe = this.props.recipe;

    for (let i = 0; i < recipe.extendedIngredients.length; i++) {
      ingredientList.push(recipe.extendedIngredients[i].original);
    }

    Axios.post("https://nightin.xyz/groceryLists", {
      googleId: this.props.auth,
      list: {
        title: this.props.recipe.title,
        list: ingredientList.join("\n")
      }
    }).then(() => {
      this.groceryListAlert.current.open();
    });
  };

  componentDidMount = () => {
    let that = this;
    Axios.get("https://nightin.xyz/savedRecipes", {
      headers: { googleId: that.props.auth }
    }).then(function(response) {
      // console.log(response.data)
      that.setState({
        p:
          response.data == undefined || response.data.length === 0
            ? false
            : response.data.find(obj => {
                return obj.id === that.props.recipe.id;
              }) != undefined
              ? true
              : false
      });
    });
  };

  //Fix this when route is implemented
  removePlanning = () => {
    // console.log(this.props)
    let that = this;
    Axios.post("https://nightin.xyz/meal/delete", {
      googleId: that.props.auth,
      meal: that.props.meal,
      date: that.props.date,
      recipeId: that.props.id
    }).then(response => {
      // console.log(response.data);
      if (response.data.success) {
        that.props.handleClose();
      } else {
        alert("Something went wrong, please try again");
      }
    });
  };

  renderSave = () => {
    let that = this;
    let test = null;

    if (that.props.auth == null || that.props.auth == false) {
      return <div />;
    } else {
      if (that.props.type == "Planning") {
        test = (
          <Button
            variant="contained"
            color="primary"
            onClick={that.removePlanning}
          >
            Remove from meal plan
          </Button>
        );
      } else if (that.props.type === "search" || !that.state.p) {
        test = (
          <Button variant="contained" color="primary" onClick={that.saveRecipe}>
            Save
          </Button>
        );
      } else if (that.props.type === "saved" || that.state.p) {
        test = (
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={that.removeRecipe}
            >
              Delete
            </Button>

            <Button
              variant={"contained"}
              color={"secondary"}
              onClick={() => {
                that.setState({
                  displayingEditModal: true
                });
              }}
            >
              Edit
            </Button>
          </span>
        );
      } else {
        test = <div />;
      }
    }
    return test;
  };

  onModalClose = () => {
    this.setState({
      displayingEditModal: false
    });
  };

  onSaveEdit = () => {
    this.setState({
      displayingEditModal: false
    });

    this.props.onSaveEdit();
  };

  updateQuantity = () => {
    Axios.post("https://nightin.xyz/multiplyIngredients", {
      recipe: this.props.recipe,
      multiplier: this.state.quantity
    }).then(response => {
      this.props.displayMultipliedRecipe(response.data);
    });
  };

  handleSubtract=()=>{
    // console.log(this.props.recipe)
    let that=this;
    Axios.post('https://nightin.xyz/reduceIngredients',{
      googleId:that.props.auth,
      ingredients:that.props.recipe.extendedIngredients
    }).then(response=>{
      console.log(response.data)
      if(response.data.success){
        alert('Ingredients successfully subtracted');
      }else{
        alert('Something happened, please try again');
      }
    })
  }

  render() {
    let quantityInput = null;
    let recipe = this.props.recipe;

    // If this is not a custom recipe
    if (recipe.id.toString().length !== 10 && this.props.type !== "saved")
      quantityInput = (
        <span id={"recipe-modal-quantity"}>
          <span id={"recipe-modal-quantity-input"}>
            <TextField
              value={this.state.quantity}
              type="number"
              label={"Quantity"}
              onChange={event => {
                this.setState({
                  quantity: event.target.value
                });
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  this.updateQuantity();
                }
              }}
            />
          </span>

          <Button variant="contained" onClick={this.updateQuantity}>
            Update
          </Button>
        </span>
      );

    return (
      <div id={"recipe-modal-toolbar"}>
        {this.renderSave()}

        <Button variant="contained" onClick={this.addToGrocery}>
          Add to Groceries
        </Button>

        <RecipePrinter recipe={recipe} />

        {this.props.type === "saved"
          ? <Button variant="contained" onClick={this.props.saveNote}>
              Save Notes
            </Button>
          : null}

        {this.props.type === "saved"
          ? <Button
              variant="contained"
              onClick={() => this.setState({ modal: true })}
            >
              Add to meal plan
            </Button>
          : null}
        <PlanningModal
          {...this.props}
          modal={this.state.modal}
          closeModal={this.closeModal}
        />
        {this.props.type === "saved" || this.props.type === "Planning"
          ? <Button onClick={this.handleSubtract} variant="contained">
              Subtract ingredients from pantry
            </Button>
          : null}

        {quantityInput}

        <AlertDialog
          title={"Success"}
          text={
            "Added ingredients for " + recipe.title + " to a new grocery list"
          }
          ref={this.groceryListAlert}
        />

        <AlertDialog
          title={"Success"}
          text={recipe.title + " has been successfully saved to your recipes!"}
          ref={this.saveSuccessAlert}
          onClose={() => {
            if (this.props.onSave) this.props.onSave();
          }}
        />

        <EditRecipeModal
          recipe={this.state.displayingEditModal ? this.props.recipe : null}
          onClose={this.onModalClose}
          onSave={this.onSaveEdit}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeToolbar);
