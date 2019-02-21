import React, { Component } from "react";
import { Button, Modal, Typography, Paper } from "@material-ui/core";
import IngredientsAutocomplete from "../IngredientsAutocomplete/IngredientsAutocomplete";
import { connect } from "react-redux";
import Axios from "axios";

class SettingsButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsModal: false,
      excludedIngredients: null,
      alert:false
    };
  }

  handleCancel = () => {
    this.setState({ settingsModal: false, excludedIngredients: null });
  };

  handleSubmit = () => {
    let that=this;
    Axios
      .post("http://localhost:8080/excludedIngredients", {
        googleId:that.props.auth,
        ingredients:that.state.excludedIngredients,
      })
      .then(response => {
        if(response.data.success){
          that.setState({excludedIngredients:null,settingsModal:false});
        } else {
          alert('Error, the data wasn\'t submitted, try again');
        }
      });
  };

  render() {
    return (
      <div>
        <Button
          onClick={() => this.setState({ settingsModal: true })}
          style={{ position: "absolute", right: "100px", color: "white" }}
        >
          Settings
        </Button>
        <Modal
          open={this.state.settingsModal}
          onClose={() => this.setState({ settingsModal: false })}
        >
          <Paper
            style={{
              position: "absolute",
              top: "30%",
              left: "25%",
              width: "50%",
              padding: "30px"
            }}
          >
            <Typography variant="h5">
              Please add all of the ingredients that you want to always exclude
              when 'Exclude Ingredients' is checked
            </Typography>
            <IngredientsAutocomplete
              label={"Excluded Ingredients"}
              onChange={ing => {
                this.setState({
                  excludedIngredients: ing
                });
              }}
            />
            <Button onClick={this.handleSubmit}>Submit</Button>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </Paper>
        </Modal>
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(SettingsButton);