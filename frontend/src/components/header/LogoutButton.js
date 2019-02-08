import React, { Component } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import history from "../../history";

class LogoutButton extends Component {
  handleLogout = () => {
    // axios.post("http://localhost:8080/logout", {}).then(() => history.push("/"));
    window.location.href='http://localhost:8080/auth/logout';
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
