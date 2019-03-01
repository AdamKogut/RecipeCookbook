import React from 'react';
import './GroceryListEditor.css';

import { Modal, Paper, Button, TextField } from '@material-ui/core';
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import AlertDialog from "../AlertDialog/AlertDialog";
import Axios from "axios/index";

class GroceryListEditor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      listEdit: props.list,
      closed: true,
      warningIsOpen: false
    };

    this.noChangesAlert = React.createRef();
  }

  handleClose = () => {
    // Check for unsaved notes
    if (this.props.list !== this.state.listEdit) {
      this.setState({
        warningIsOpen: true
      });

      return;
    }

    // close the modal
    this.props.onClose();
    this.setState({
      recipeEdit: {},
      closed: true,
      warningIsOpen: false
    });
  };

  parseInput = (text) => {
    this.setState({
      listEdit: {
        ...this.state.listEdit,
        list: text
      }
    });
  };

  saveList = () => {
    if (this.props.list === this.state.listEdit) {
      this.noChangesAlert.current.open();
      return;
    }

    let ingredientsList = this.state.listEdit.list.split("\n").filter(function (el) {
      return el !== "";
    });

    ingredientsList = ingredientsList.join("\n");

    if (this.props.add) {
      Axios.post("http://localhost:8080/groceryLists", {
        googleId: this.props.auth,
        list: this.state.listEdit
      }).then(()=>{
        if (this.props.onSave)
          this.props.onSave();
      });
    } else {
      console.log({
        listEdit: {
          ...this.state.listEdit,
          list: ingredientsList
        }
      });
    }

    // close the modal
    this.props.onClose();
    this.setState({
      recipeEdit: {},
      closed: true,
      warningIsOpen: false
    });
  };

  render () {
    // If this has just been opened, initialize stuff
    if (this.props.list && this.state.closed) {
      this.setState({
        closed: false,
        listEdit: this.props.list
      });

      return null;
    }

    let content;
    if (this.state.listEdit) {
      content = (
        <div>
          <TextField
            id={'edit-list-modal-title'}
            onChange={(event) => {
              this.setState({
                listEdit: {
                  ...this.state.listEdit,
                  title: event.target.value
                }
              });
            }}
            value={this.state.listEdit.title}
            fullWidth
            label={'List Title'}
          />

          <div id={"edit-list-modal-toolbar"}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.saveList}
            >
              Save
            </Button>

            <Button
              variant="contained"
              onClick={this.handleClose}
            >
              Cancel
            </Button>
          </div>
          <br />

          <div id={'edit-list-modal-description'}>
            <em>Enter Ingredients as one per line</em>
            <br />
            <br />

            <TextField
              onChange={(event) => {
                this.parseInput(event.target.value);
              }}
              className={'edit-list-modal-textarea'}
              value={this.state.listEdit.list}
              multiline
            />
          </div>
        </div>
      );
    } else {
      content = <Loader/>
    }

    return (
      <div>
        <Modal
          open={this.props.list !== null}
          onClose={this.handleClose}
        >
          <Paper className={'modal-container'}>
            {content}
          </Paper>
        </Modal>

        <ConfirmationDialog
          isOpen={this.state.warningIsOpen}
          title={"Exit?"}
          text={"You have unsaved changes for this list. Exit anyways?"}
          agreeText={"Yes"}
          disagreeText={"No"}
          onClose={() => {
            this.setState({
              warningIsOpen: false
            });
          }}
          onAgree={() => {
            // close the modal
            this.props.onClose();
            this.setState({
              listEdit: {},
              closed: true,
              warningIsOpen: false
            });
          }}
        />

        <AlertDialog
          title={"Alert"}
          text={"There are no changes to be saved for the current list"}
          ref={this.noChangesAlert}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(GroceryListEditor);