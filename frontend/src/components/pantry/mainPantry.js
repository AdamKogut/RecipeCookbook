import React, { Component } from "react";
import BodyContainer from "../BodyContainer/BodyContainer";
import { Button } from "@material-ui/core";
import AddItemModal from "./AddItemModal";
import "./mainPantry.css";

class mainPantry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    return (
      <div className="BigDivArea">
        <AddItemModal {...this.state} closeModal={this.closeModal} />
        <BodyContainer>
          <Button onClick={() => this.setState({ modal: true })}>
            Add Item
          </Button>
        </BodyContainer>
      </div>
    );
  }
}

export default mainPantry;
