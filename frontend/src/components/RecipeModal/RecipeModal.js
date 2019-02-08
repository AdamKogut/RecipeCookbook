import React from 'react';
import './RecipeModal.css';

import { Modal, Paper, Button, AppBar, Tabs, Tab } from '@material-ui/core';
import Loader from "../Loader/Loader";
import axios from "axios/index";

class RecipeModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      recipe: {},
      currentTab: 0,
      closed: true
    };
  }

  getData = () => {
    // Grab the recipe data from the api using props.id
    axios.get(
      'http://localhost:8080/recipeInfo',
      {
        headers: {
          id: this.props.id,
          includeNutrition: 'true'
        }
      }
    ).then((response) => {
      this.setState({
        recipe: response.data.body
      });
    });
  };

  handleTab = (event, value) => {
    this.setState({ currentTab: value });
  };

  handleClose = () => {
    this.props.onClose();
    this.setState({
      recipe: {},
      currentTab: 0,
      closed: true
    });
  };

  render () {
    const currentTab = this.state.currentTab;

    // If this has just been opened, grab the data from the server
    if (this.props.id && this.state.closed) {
      this.setState({closed: false});
      this.getData();
    }

    let content;
    if (this.state.recipe.title) {
      const recipe = this.state.recipe;
      const ingredients = [];
      const instructions = [];

      for (let i = 0; i < recipe.extendedIngredients.length; i++) {
        ingredients.push(
          <li key={'ingredient' + i}>
            { recipe.extendedIngredients[i].original }
          </li>
        );
      }

      for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
        instructions.push(
          <li key={'ingredient' + i}>
            { recipe.analyzedInstructions[0].steps[i].step }
          </li>
        );
      }

      content = (
        <div>
          <h1 id={'recipe-modal-title'}>
            {recipe.title}
          </h1>

          <img id={'recipe-modal-image'} src={recipe.image} />

          <div id={'recipe-modal-toolbar'}>
            <Button variant="contained" color="primary">
              Save
            </Button>

            <Button variant="contained">
              Add to Groceries
            </Button>

            <Button variant="contained">
              Print
            </Button>
          </div>

          <div id={'recipe-modal-description'}>
            <AppBar position="static" color={'default'}>
              <Tabs value={currentTab} onChange={this.handleTab} variant={'fullWidth'}>
                <Tab label="Ingredients" />
                <Tab label="Instructions" />
                <Tab label="Nutrition" />
              </Tabs>
            </AppBar>
            {currentTab === 0 && <div className={'recipe-modal-tab-content'}><ul>{ingredients}</ul></div>}
            {currentTab === 1 && <div className={'recipe-modal-tab-content'}><ul>{instructions}</ul></div>}
            {currentTab === 2 && <div className={'recipe-modal-tab-content'}></div>}
          </div>
        </div>
      );
    } else {
      content = <Loader/>
    }

    return (
      <Modal
        open={this.props.id !== null}
        onClose={this.handleClose}
      >
        <Paper className={'modal-container'}>
          {content}
        </Paper>
      </Modal>
    );
  }
}

export default RecipeModal;