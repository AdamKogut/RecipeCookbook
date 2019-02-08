import React, { Component } from "react";
import {Button} from '@material-ui/core';
import RecipePrinter from '../RecipePrinter/RecipePrinter';
import {connect} from 'react-redux';
import './RecipeModal.css';

class RecipeToolbar extends Component {
  saveRecipe=()=>{

  }

  removeRecipe=()=>{
    
  }

  renderSave=()=>{
    if(this.props.auth==null||this.props.auth==false){
      return <div/>
    } else {
      if(this.props.type==='search'){
        return <Button variant="contained" color="primary" onClick={this.saveRecipe}>
          Save
        </Button>;
      }else if(this.props.type==='saved'){
        return <Button variant="contained" color="primary" onClick={this.removeRecipe}>
          Delete
        </Button>;
      }else
        return null;
    }
  }

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
