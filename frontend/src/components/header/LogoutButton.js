import React, { Component } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import history from "../../history";

class LogoutButton extends Component {
  handleLogout = () => {
    window.location.href='http://localhost:3000';
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
