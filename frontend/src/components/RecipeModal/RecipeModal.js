import React from 'react';
import './RecipeModal.css';

import { Modal, Paper, Button } from '@material-ui/core';
import Loader from "../Loader/Loader";

class RecipeModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      recipe: {}
    };

    // Grab the recipe data from the api using props.id
    setTimeout(() => {
      this.setState({
        recipe: {
          title: 'Delicious Burger',
          description: 'Insert description/recipe here',
          img: 'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg'
        }
      });
    }, 3000);
  }

  handleClose = () => {
    this.props.onClose();
  };

  render () {
    let content;
    if (this.state.recipe.title) {
      const recipe = this.state.recipe;

      content = (
        <div>
          <h1 id={'recipe-modal-title'}>
            {recipe.title}
          </h1>

          <img id={'recipe-modal-image'} src={recipe.img} />

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

          <Paper id={'recipe-modal-description'}>
            {recipe.description}
          </Paper>
        </div>
      );
    } else {
      content = <Loader/>
    }

    return (
      <Modal
        open={this.props.id}
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