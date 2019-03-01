import React, { Component } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import history from "../../history";

class LogoutButton extends Component {
  handleLogout = () => {
    document.cookie=`user=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    window.location.href='https://night-in-12.firebaseapp.com/';
  };

  render() {
    // console.log(document.cookie)
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
