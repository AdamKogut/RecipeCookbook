import React, { Component } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import history from "../../history";

class LogoutButton extends Component {
  handleLogout = () => {
    window.location.href='https://night-in-12.firebaseapp.com/';
  };

  render() {
    return (
      <Button
        onClick={this.handleLogout}
        style={{ position: "absolute", right: "10px", color: "white" }}
      >
        Logout
      </Button>
    );
  }
}

export default LogoutButton;
