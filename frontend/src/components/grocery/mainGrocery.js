import React, { Component } from "react";
import "./mainGrocery.css";

import GroceryList from "../GroceryList/GroceryList";
import BodyContainer from "../BodyContainer/BodyContainer";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import GroceryListEditor from "../GroceryListEditor/GroceryListEditor";
import Axios from "axios";
import connect from "react-redux/es/connect/connect";
import { Button } from "@material-ui/core";
import Loader from "../Loader/Loader";
import ReactToPrint from 'react-to-print';

class mainGrocery extends Component {
  constructor (props) {
    super(props);

    this.state = {
      groceryLists: [],
      listToDelete: null,
      listToEdit: null,
      deleteDialogIsOpen: false,
      displayingEditModal: false,
      displayingAddModal: false,
      isLoading: false,
      isPrinting: false
    };
  }

  componentDidMount = () => {
    this.getGroceryLists();
  };

  getGroceryLists = () => {
    this.setState({
      isLoading: true
    });

    setTimeout(() => {
      Axios.get("http://localhost:8080/groceryLists", {
        headers: {
          googleId: this.props.auth
        }
      }).then((response) => {
        this.setState({
          groceryLists: response.data.list,
          isLoading: false
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
      displayingEditModal: false,
      displayingAddModal: false
    });
  };

  onDeleteList = (name) => {
    this.setState({
      listToDelete: name,
      deleteDialogIsOpen: true
    });
  };

  deleteList = (name) => {
    Axios.post("http://localhost:8080/deleteGroceryList", {
      googleId: this.props.auth,
      title: name
    }).then(()=>{
      this.setState({
        deleteDialogIsOpen: false
      });

      this.getGroceryLists();
    });
  };

  onSaveEdit = () => {
    this.getGroceryLists();
    this.onEditClose();
  };

  render() {
    const groceryLists = [];

    if (this.state.isLoading) {
      groceryLists.push(
        <Loader />
      );
    } else if (this.state.groceryLists.length === 0) {
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
            key={i}
          />
        );
      }
    }

    return (
      <div className='BigDivArea'>
        <BodyContainer>
          <div id={'grocery-toolbar'}>
            <Button
              variant="contained"
              color={"primary"}
              onClick={() => {
                this.setState({
                  displayingAddModal: true,
                  listToEdit: {
                    title: "",
                    list: ""
                  }
                });
              }}
            >
              Add New
            </Button>

            <ReactToPrint
              trigger={() => <Button variant="contained">Print</Button>}
              content={() => this.componentRef}
              onBeforePrint={() => {
                this.setState({
                  isPrinting: true
                });
              }}
              onAfterPrint={() => {
                this.setState({
                  isPrinting: false
                });
              }}
            />
          </div>

          <div
            ref={el => (this.componentRef = el)}
          >
            {groceryLists}
          </div>
        </BodyContainer>

        <GroceryListEditor
          list={this.state.displayingEditModal ? this.state.listToEdit : null}
          onClose={this.onEditClose}
          onSave={this.onSaveEdit}
        />

        <GroceryListEditor
          list={this.state.displayingAddModal ? this.state.listToEdit : null}
          onClose={this.onEditClose}
          onSave={this.onSaveEdit}
          add
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