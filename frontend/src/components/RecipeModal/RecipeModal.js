import React from 'react';
import './RecipeModal.css';

import { Modal, Paper, Button, AppBar, Tabs, Tab, TextField } from '@material-ui/core';
import Loader from "../Loader/Loader";
import axios from "axios/index";
import RecipePrinter from "../RecipePrinter/RecipePrinter";
import RecipeToolbar from './RecipeToolbar';
import { connect } from "react-redux";

class RecipeModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      recipe: {},
      currentTab: 0,
      closed: true,
      notes: ''
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

    // Grab the recipe notes if on the saved page
    if (this.props.type === 'saved') {
      axios.get(
        'http://localhost:8080/recipeNote',
        {
          headers: {
            googleId: this.props.auth
          }
        }
      ).then((response) => {
        console.log(response);

        let note = '';
        const notes = response.data[0].notes;
        for (let i = 0; i < notes.length; i++) {
          if (notes[i].recipeId === this.props.id) {
            note = notes[i].note;
            break;
          }
        }

        this.setState({
          notes: note
        });
      });
    }
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

  saveNotes = () => {
    console.log('save');
    axios.post(
      'http://localhost:8080/recipeNote',
      {
        googleId: this.props.auth,
        recipeId: this.props.id,
        note: this.state.notes
      }
    );
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

      const notesTab = this.props.type === 'saved' ? <Tab label="Notes" /> : null;
      const notesBox = (
        <TextField
          label="Notes"
          value={this.state.notes}
          multiline
          rows="10"
          margin="normal"
          variant="outlined"
          fullWidth
          onChange={(event) => {
            this.setState({
              notes: event.target.value
            })
          }}
        />
      );

      content = (
        <div>
          <h1 id={'recipe-modal-title'}>
            {recipe.title}
          </h1>

          <img id={'recipe-modal-image'} src={recipe.image} alt={`recipe: ${recipe.title}`} />

          <RecipeToolbar
            recipe={recipe}
            type={this.props.type}
            saveNote={this.saveNotes}
            onSave={() => {
              if (this.props.type === "saved")
                this.props.updateSavedList();
            }}
            onDelete={() => {
              if (this.props.type === "saved")
                this.props.updateSavedList();
            }}
          />

          <div id={'recipe-modal-description'}>
            <AppBar position="static" color={'default'}>
              <Tabs value={currentTab} onChange={this.handleTab} variant={'fullWidth'}>
                <Tab label="Ingredients" />
                <Tab label="Instructions" />
                <Tab label="Nutrition" />
                {notesTab}
              </Tabs>
            </AppBar>
            {currentTab === 0 && <div className={'recipe-modal-tab-content'}><ul>{ingredients}</ul></div>}
            {currentTab === 1 && <div className={'recipe-modal-tab-content'}><ul>{instructions}</ul></div>}
            {currentTab === 2 && <div className={'recipe-modal-tab-content'}></div>}
            {currentTab === 3 && <div className={'recipe-modal-tab-content'}>{notesBox}</div>}
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

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(RecipeModal);