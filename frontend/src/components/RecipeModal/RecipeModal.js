import React from 'react';
import './RecipeModal.css';

import { Modal, Paper } from '@material-ui/core';
import Loader from "../Loader/Loader";

class RecipeModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      recipe: {}
    };

    setTimeout(() => {
      this.setState({
        recipe: {
          title: 'asdf',
          description: 'lorum ipsum blah blah blah',
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
      content = (
        <div>
          Hello world!
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