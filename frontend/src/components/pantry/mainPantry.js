import React, { Component } from "react";
import BodyContainer from "../BodyContainer/BodyContainer";
import { Button, Paper, Typography } from "@material-ui/core";
import AddItemModal from "./AddItemModal";
import { connect } from "react-redux";
import "./mainPantry.css";
import Axios from "axios";
import EditItemModal from "./EditItemModal";

class mainPantry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      items: [],
      current: null,
      editModal: false
    };
  }

  closeModal = () => {
    this.setState({ modal: false }, this.componentDidMount);
  };

  edit = item => {
    this.setState({ current: item, editModal: true });
  };

  closeEdit = () => {
    this.setState({ editModal: false, current: null }, this.componentDidMount);
  };

  remove = item => {
    let that = this;
    Axios.delete("https://nightin.xyz:8080/onhandIngredients", {
      data: {
        googleId: that.props.auth,
        ingredients: item
      }
    }).then(response => {
      if (response.data.success) {
        alert(item.ingredient + " was removed");
        that.componentDidMount();
        that.setState({ editModal: false });
      }
    });
  };

  removeAll = () => {
    let that = this;
    Axios.post("https://nightin.xyz:8080/onhandIngredients/purge", {
      googleId: that.props.auth
    }).then(response => {
      if (response.data.success) {
        that.componentDidMount();
      }
    });
  };

  componentDidMount = () => {
    let that = this;
    setTimeout(() => {
      Axios.get("https://nightin.xyz:8080/onhandIngredients", {
        headers: { googleId: that.props.auth }
      }).then(response => {
        let e = [];
        for (let i in response.data[0].onhandIngredients) {
          e.push(
            <Paper
              elevation={1}
              key={i}
              style={{ width: "60%", marginLeft: "20%", marginTop: "10px" }}
            >
              <Typography
                variant="h6"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                {`${response.data[0].onhandIngredients[i].quantity} ${response
                  .data[0].onhandIngredients[i].unit} ${response.data[0]
                  .onhandIngredients[i].ingredient} `}
              </Typography>
              <Typography
                variant="subtitle2"
                style={{ paddingLeft: "40px", paddingRight: "20px" }}
              >
                {response.data[0].onhandIngredients[i].date !== "none"
                  ? "Bought: " + response.data[0].onhandIngredients[i].date
                  : ""}
              </Typography>
              <Button
                onClick={() => that.edit(response.data[0].onhandIngredients[i])}
              >
                Edit
              </Button>
              <Button
                onClick={() =>
                  that.remove(response.data[0].onhandIngredients[i])}
              >
                Remove
              </Button>
            </Paper>
          );
        }

        if (e.length === 0) {
          e.push(
            <Paper
              elevation={1}
              key={1}
              style={{ width: "60%", marginLeft: "20%", marginTop: "10px" }}
            >
              <Typography variant="h5" style={{ padding: "20px" }}>
                You currently have no ingredients, click 'ADD ITEM' above to add
                one
              </Typography>
            </Paper>
          );
        }
        that.setState({ items: e });
      });
    }, 20);
  };

  render () {
    return (
      <div className="BigDivArea">
        <AddItemModal {...this.state} closeModal={this.closeModal} />
        <BodyContainer>

          <div id={"pantry-button-row"}>
            <Button
              onClick={() => this.setState({
                modal: true
              })}
              variant={"contained"}
              color={"primary"}
            >
              Add Item
            </Button>

            <Button
              onClick={this.removeAll}
              variant={"contained"}
            >
              Remove all items
            </Button>
          </div>

          {this.state.items}
        </BodyContainer>
        <EditItemModal
          current={this.state.current}
          editModal={this.state.editModal}
          closeEdit={this.closeEdit}
          remove={this.remove}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainPantry);
