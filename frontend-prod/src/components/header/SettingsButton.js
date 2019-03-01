import React, { Component } from "react";
import {
  Button,
  Modal,
  Typography,
  Paper,
  Select,
  MenuItem
} from "@material-ui/core";
import IngredientsAutocomplete from "../IngredientsAutocomplete/IngredientsAutocomplete";
import { connect } from "react-redux";
import Axios from "axios";

class SettingsButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsModal: false,
      excludedIngredients: "",
      alert: false,
      currExcl: [],
      clear: false,
      diet: "none"
    };
  }

  getExcluded = () => {
    let that = this;
    Axios.get("https://nightin.xyz/excludedIngredients", {
      headers: { googleId: that.props.auth }
    }).then(function(response) {
      // console.log(response.data);
      let temparr = [];
      let tempstr = "";
      for (let i in response.data.excludedIngredients) {
        if (response.data.excludedIngredients[i] == "") continue;
        tempstr += response.data.excludedIngredients[i] + ",";
        temparr.push(
          <Button
            onClick={() =>
              that.handleClear(response.data.excludedIngredients[i])}
            key={i}
          >
            {response.data.excludedIngredients[i]}--Clear item
          </Button>
        );
      }
      that.setState({
        excludedIngredients: tempstr,
        currExcl: temparr,
        clear: true,
        diet: response.data.diet
      });
    });
  };

  handleClear = item => {
    // console.log(item)
    let s = this.state.excludedIngredients.split(",");
    // console.log(s)
    let s2 = "";
    let a = this.state.currExcl;
    let a2 = [];
    for (let i in s) {
      // console.log(item+','+s[i])
      if (s[i] != item && s[i] != "") {
        // console.log(s[i])
        s2 += s[i] + ",";
        a2.push(a[i]);
      }
    }
    this.setState({ currExcl: a2, excludedIngredients: s2 }, () =>
      console.log(s2)
    );
  };

  handleCancel = () => {
    this.setState({
      settingsModal: false,
      excludedIngredients: null,
      clear: false,
      diet: "none"
    });
  };

  handleSubmit = () => {
    let that = this;
    Axios.post("https://nightin.xyz/excludedIngredients", {
      googleId: that.props.auth,
      ingredients: that.state.excludedIngredients.substring(
        0,
        that.state.excludedIngredients.length - 1
      ),
      diet: that.state.diet
    }).then(response => {
      if (response.data.success) {
        that.setState({
          excludedIngredients: null,
          settingsModal: false,
          clear: false,
          diet: "none"
        });
      } else {
        alert("Error, the data wasn't submitted, try again");
      }
    });
  };

  handleChange = item => {
    let s = this.state.excludedIngredients;
    for (let i in item.selectedItem) {
      if (s.search(item.selectedItem[i]) === -1) {
        s += item.selectedItem[i] + ",";
      }
    }
    this.setState({ excludedIngredients: s });
  };

  render() {
    if (!this.state.clear) this.getExcluded();
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
            <Typography variant="h4">Settings</Typography>
            <br/>
            <Typography variant="h5">Please choose your diet</Typography>
            <div style={{ paddingLeft: "10px" }}>
              <Select
                value={this.state.diet}
                onChange={event => this.setState({ diet: event.target.value })}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="pescetarian">Pescetarian</MenuItem>
                <MenuItem value="lacto vegetarian">Lacto Vegetarian</MenuItem>
                <MenuItem value="ovo vegetarian">Ovo Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
              </Select>
            </div>
            <br />
            <Typography variant="h5">
              Excluded Ingredients
            </Typography>
            {this.state.currExcl.length !== 0
              ? <div>
                  <br />
                  <Typography variant="h6">
                    Current Excluded Ingredients
                  </Typography>
                  {this.state.currExcl}
                </div>
              : <br />}
            <IngredientsAutocomplete
              label={"Excluded Ingredients"}
              onChange={this.handleChange}
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
