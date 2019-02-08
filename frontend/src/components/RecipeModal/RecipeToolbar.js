import React, { Component } from "react";
import { Button } from "@material-ui/core";
import RecipePrinter from "../RecipePrinter/RecipePrinter";
import { connect } from "react-redux";
import "./RecipeModal.css";
import Axios from "axios";

class RecipeToolbar extends Component {
  constructor(props) {
    super(props);
    this.state={
      a:false,
      q:false,
    }
  }

  saveRecipe = () => {
    let that = this;
    Axios.post("http://localhost:8080/savedRecipes", {
      user: that.props.auth,
      recipe: that.props.recipe
    }).then(()=>{console.log('hi');that.setState({a:!that.state.a})});
  };

  removeRecipe = () => {
    let that=this
    Axios.post("http://localhost:8080/deleteSavedRecipe", {
      name: that.props.auth,
      deleteID: that.props.recipe.id
    }).then(()=>{console.log('hi');that.setState({a:!that.state.a})});
  };

  componentDidMount = () => {
    let that = this;
    Axios.get("http://localhost:8080/savedRecipes", {
      headers: { name: that.props.auth }
    }).then(function(response) {
      that.setState({
        p:
          response.data.length === 0
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

        <Button variant="contained">Add to Groceries</Button>

        <RecipePrinter recipe={this.props.recipe} />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeToolbar);
