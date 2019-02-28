import React, { Component } from "react";
import "./mainGrocery.css";

import GroceryList from "../GroceryList/GroceryList";
import BodyContainer from "../BodyContainer/BodyContainer";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import GroceryListEditor from "../GroceryListEditor/GroceryListEditor";
import Axios from "axios";
import connect from "react-redux/es/connect/connect";

class mainGrocery extends Component {
  constructor (props) {
    super(props);

    this.state = {
      groceryLists: [],
      listToDelete: null,
      listToEdit: null,
      deleteDialogIsOpen: false,
      displayingEditModal: false
    };
  }

  componentDidMount = () => {
    this.getGroceryLists();
  };

  getGroceryLists = () => {
    setTimeout(() => {
      Axios.get("http://localhost:8080/groceryLists", {
        headers: {
          googleId: this.props.auth
        }
      }).then((response) => {
        console.log(response.data);

        this.setState({
          groceryLists: response.data.list
        });
      });
    }, 10);
  };

  onEditList = (list) => {
    this.setState({
      listToEdit: list,
      displayingEditModal: true
    });
  };

  onEditClose = () => {
    this.setState({
      listToEdit: null,
      displayingEditModal: false
    });
  };

  onDeleteList = (name) => {
    this.setState({
      listToDelete: name,
      deleteDialogIsOpen: true
    });
  };

  deleteList = (name) => {
    this.setState({
      deleteDialogIsOpen: false
    });
  };

  render() {
    const groceryLists = [];

    if (this.state.groceryLists.length === 0) {
      groceryLists.push(
        <div>
          Create some Grocery Lists to see them here!
        </div>
      );
    } else {
      for (let i = 0; i < this.state.groceryLists.length; i++) {
        groceryLists.push(
          <GroceryList
            list={this.state.groceryLists[i]} key={"groceryList" + i}
            onUpdate={this.getGroceryLists}
            onDelete={this.onDeleteList}
            onEdit={this.onEditList}
          />
        );
      }
    }

    return (
      <div className='BigDivArea'>
        <BodyContainer>
          {groceryLists}
        </BodyContainer>

        <GroceryListEditor
          list={this.state.displayingEditModal ? this.state.listToEdit : null}
          onClose={this.onEditClose}
          onSave={this.onSaveEdit}
        />

        <ConfirmationDialog
          isOpen={this.state.deleteDialogIsOpen}
          title={"Delete List"}
          text={"Are you sure you want to delete " + this.state.listToDelete + "?"}
          agreeText={"Yes"}
          disagreeText={"No"}
          onClose={() => {
            this.setState({
              deleteDialogIsOpen: false
            });
          }}
          onAgree={() => {
            this.deleteList(this.state.listToDelete);
          }}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainGrocery);