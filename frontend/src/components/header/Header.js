import React, { Component } from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@material-ui/core";
import { connect } from "react-redux";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import History from "../../history";

class Header extends Component {
  constructor(props) {
    super(props);
    let temp = 0;
    if (!History.location.pathname.indexOf("/grocery")) {
      temp = 1;
    } else if (!History.location.pathname.indexOf("/pantry")) {
      temp = 2;
    } else if (!History.location.pathname.indexOf("/planning")) {
      temp = 3;
    } else if (!History.location.pathname.indexOf("/saved")) {
      temp = 4;
    }
    this.state = {
      tabValue: temp
    };
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
    if (newValue === 0) {
      History.push("/");
    } else if (newValue === 1) {
      History.push("/grocery");
    } else if (newValue === 2) {
      History.push("/pantry");
    } else if (newValue === 3) {
      History.push("/planning");
    } else if (newValue === 4) {
      History.push("/saved");
    }
  };

  renderTab=()=>{
    switch(this.props.auth){
      case null:
        return;
      case false:
        return <div />;
      default:
        return <Tab label="Saved Recipes" value={4} />;
    }
  }

  renderButton=()=>{
    switch(this.props.auth){
      case null:
        return;
      case false:
        return <LoginButton />;
      default:
        return <LogoutButton />;
    }
  }

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
            {/* {this.renderTab()} */}
          </Tabs>
          {this.renderButton()}
        </Toolbar>
      </AppBar>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(Header);
