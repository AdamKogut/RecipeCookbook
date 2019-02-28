import React, { Component } from "react";
import { Button } from "@material-ui/core";
import RecipePrinter from "../RecipePrinter/RecipePrinter";
import { connect } from "react-redux";
import "./RecipeModal.css";
import Axios from "axios";
import AlertDialog from "../AlertDialog/AlertDialog";

class RecipeToolbar extends Component {
  constructor(props) {
    super(props);
    this.state={
      a:false,
      q:false,
    };

    this.groceryListAlert = React.createRef();
    this.saveSuccessAlert = React.createRef();
  }

  saveRecipe = () => {
    let that = this;
    Axios.post("http://localhost:8080/savedRecipes", {
      googleId: that.props.auth,
      recipe: that.props.recipe
    }).then(()=>{
      that.setState({p:!that.state.p});
      this.saveSuccessAlert.current.open();
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

  addToGrocery = () => {
    const ingredientList = [];
    const recipe = this.props.recipe;

    for (let i = 0; i < recipe.extendedIngredients.length; i++) {
      ingredientList.push(
        recipe.extendedIngredients[i].original
      );
    }

    Axios.post("http://localhost:8080/groceryLists", {
      googleId: this.props.auth,
      list: {
        title: this.props.recipe.title,
        list: ingredientList.join("\n")
      }
    }).then(()=>{
      this.groceryListAlert.current.open();
    });
  };

  componentDidMount = () => {
    let that = this;
    Axios.get("http://localhost:8080/savedRecipes", {
      headers: { googleId: that.props.auth }
    }).then(function(response) {
      // console.log(response.data)
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
          <Button
            variant="contained"
            color="primary"
            onClick={that.removeRecipe}
          >
            Delete
          </Button>
        );
      } else {
        test = <div />;
      }
    }
    return test;
  };

  render() {
    return (
      <div id={"recipe-modal-toolbar"}>
        {this.renderSave()}

        <Button
          variant="contained"
          onClick={this.addToGrocery}
        >
          Add to Groceries
        </Button>

        <RecipePrinter recipe={this.props.recipe} />

        {this.props.type === 'saved' ? <Button variant="contained" onClick={this.props.saveNote} >Save Notes</Button> : null}

        <AlertDialog
          title={"Success"}
          text={"Added ingredients for " + this.props.recipe.title + " to a new grocery list"}
          ref={this.groceryListAlert}
        />

        <AlertDialog
          title={"Success"}
          text={this.props.recipe.title + " has been successfully saved to your recipes!"}
          ref={this.saveSuccessAlert}
          onClose={() => {
            if (this.props.onSave)
              this.props.onSave();
          }}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeToolbar);
