import React, { Component } from "react";
import {Button} from '@material-ui/core';

class LoginButton extends Component {
  handleLogin=()=>{
    window.location.href = "/auth/google";
  };

  render() {
    return (
      <Button
        onClick={this.handleLogin}
        style={{ position: "absolute", right: "10px", color:'white' }}
      >
        Create Account/Login
      </Button>
    );
  }
}

export default LoginButton;
