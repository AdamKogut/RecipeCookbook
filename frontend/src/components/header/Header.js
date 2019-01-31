import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { AppBar, Toolbar, Tabs, Tab, Button } from "@material-ui/core";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0
    };
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  render() {
    return (
      <AppBar position="static">
        <Toolbar variant="dense">
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Home" value={0} />
            <Tab label="Grocery List" value={1} />
            <Tab label="Pantry" value={2} />
            <Tab label="Meal Planning" value={3} />
            <Tab label="Saved Recipes" value={4} />
          </Tabs>
          <Button
            onClick={this.handleLogin}
            style={{ position: "absolute", right: "10px" }}
          >
            Create Account/Login
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
