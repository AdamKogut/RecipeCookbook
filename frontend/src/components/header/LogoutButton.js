import React, { Component } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import history from "../../history";

class LogoutButton extends Component {
  handleLogout = () => {
    axios.post("/logout", {}).then(() => history.push("/"));
  };

  render() {
    return (
      <Button
        onClick={this.handleLogin}
        style={{ position: "absolute", right: "10px", color: "white" }}
      >
        Logout
      </Button>
    );
  }
}

export default LogoutButton;
