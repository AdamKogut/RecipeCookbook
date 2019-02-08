import React, { Component } from "react";
import "./mainSave.css";

class RecipeTiles extends Component {
  render() {
    return (
      <div className="BigDivArea">
        {this.props.cards}
      </div>
    );
  }
}

export default RecipeTiles;
