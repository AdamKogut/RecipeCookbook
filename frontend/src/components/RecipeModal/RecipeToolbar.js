import React, { Component } from "react";
import { Button } from "@material-ui/core";
import RecipePrinter from "../RecipePrinter/RecipePrinter";
import { connect } from "react-redux";
import PlanningModal from './PlanningModal';
import "./RecipeModal.css";
import Axios from "axios";

class RecipeToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: false,
      q: false,
      p: false,
      modal:false,
    };
  }

  closeModal=()=>{
    this.setState({modal:false});
  }

  saveRecipe = () => {
    let that = this;
    Axios.post("http://localhost:8080/savedRecipes", {
      googleId: that.props.auth,
      recipe: that.props.recipe
    }).then(() => {
      that.setState({ p: !that.state.p });
      alert("Successfully saved!");

      if (this.props.onSave) this.props.onSave();
      that.props.handleClose();
    });
  };

  removeRecipe = () => {
    let that = this;
    Axios.post("http://localhost:8080/deleteSavedRecipe", {
      googleId: that.props.auth,
      deleteID: that.props.recipe.id
    }).then(() => {
      that.setState({ p: !that.state.p });

      if (this.props.onDelete) this.props.onDelete();
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
          response.data[0].recipes == undefined ||
          response.data[0].recipes.length === 0
            ? false
            : response.data[0].recipes.find(obj => {
                return obj.id === that.props.recipe.id;
              }) != undefined
              ? true
              : false
      });
    });
  };

  //Fix this when route is implemented
  removePlanning = () => {
    let that = this;
    Axios.post("http://localhost:8080/removeMealPlan", {
      id: that.props.id,
      meal: that.props.meal,
      date: that.props.date
    }).then(response => {
      console.log(response.data);
      that.props.handleClose();
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

        {this.props.type === "saved"
          ? <Button variant="contained" onClick={this.props.saveNote}>
              Save Notes
            </Button>
          : null}

        {this.props.type === "saved"
          ? <Button variant="contained" onClick={()=>this.setState({modal:true})}>
              Add to meal plan
            </Button>
          : null}
        <PlanningModal {...this.props} modal={this.state.modal} closeModal={this.closeModal}/>
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeToolbar);
