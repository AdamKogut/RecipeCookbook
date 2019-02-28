import React, { Component } from "react";
import {Button, TextField} from "@material-ui/core";
import RecipePrinter from "../RecipePrinter/RecipePrinter";
import { connect } from "react-redux";
import "./RecipeModal.css";
import Axios from "axios";
import EditRecipeModal from "../EditRecipeModal/EditRecipeModal";

class RecipeToolbar extends Component {
  constructor(props) {
    super(props);
    this.state={
      a:false,
      q:false,
      displayingEditModal: false,
      quantity: 1
    }
  }

  saveRecipe = () => {
    let that = this;
    Axios.post("http://localhost:8080/savedRecipes", {
      googleId: that.props.auth,
      recipe: that.props.recipe
    }).then(()=>{
      that.setState({p:!that.state.p});

      if (this.props.onSave)
        this.props.onSave();
    });
  };

  removeRecipe = () => {
    let that=this;
    Axios.post("http://localhost:8080/deleteSavedRecipe", {
      googleId: that.props.auth,
      deleteID: that.props.recipe.id
    }).then(()=>{
      that.setState({p:!that.state.p});

      if (this.props.onDelete)
        this.props.onDelete();
    });
  };

  componentDidMount = () => {
    let that = this;
    Axios.get("http://localhost:8080/savedRecipes", {
      headers: { googleId: that.props.auth }
    }).then(function(response) {
      console.log(response.data)
      that.setState({
        p:
          response.data[0].recipes==undefined||response.data[0].recipes.length === 0
            ? false
            : response.data[0].recipes.find(obj => {
              return obj.id === that.props.recipe.id;
            }) != undefined
            ? true
            : false
      });
    });
  };

  renderSave = () => {
    let that = this;
    let test = null;

    if (that.props.auth == null || that.props.auth == false) {
      return <div />;
    } else {
      if (that.props.type === "search" || !that.state.p) {
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
      displayingEditModal: false,
    });

    this.props.onSaveEdit();
  };

  updateQuantity = () => {
    console.log(this.state.quantity);
  };

  render() {
    let quantityInput = null;

    // If this is not a custom recipe
    if (this.props.recipe.id.toString().length !== 10)
      quantityInput = (
        <span id={"recipe-modal-quantity"}>
          <span id={"recipe-modal-quantity-input"}>
            <TextField
              value={this.state.quantity}
              type="number"
              label={'Quantity'}
              onChange={(event) => {
                this.setState({
                  quantity: event.target.value
                })
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.updateQuantity();
                }
              }}
            />
          </span>

          <Button
            variant="contained"
            onClick={this.updateQuantity}
          >
            Update
          </Button>
        </span>
      );

    return (
      <div id={"recipe-modal-toolbar"}>
        {this.renderSave()}

        <Button variant="contained">Add to Groceries</Button>

        <RecipePrinter recipe={this.props.recipe} />

        {this.props.type === 'saved' ? <Button variant="contained" onClick={this.props.saveNote} >Save Notes</Button> : null}

        { quantityInput }

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
