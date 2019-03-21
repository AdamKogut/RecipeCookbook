import React, { Component } from "react";
import {Button} from '@material-ui/core';
//import firebase from 'firebase';

class LoginButton extends Component {
  handleLogin=()=>{
    window.location.href = "http://localhost:8080/auth/google";
  };

  handleGoogleLogin() {
    loginWithGoogle()
      .catch(function (error) {
        alert(error);
        localStorage.removeItem(firebaseAuthKey);
      });
    localStorage.setItem(firebaseAuthKey, "1");
  }

  firebaseAuth().onAuthStateChanged(user => {
    if(user) {
      console.log("User signed in: ", JSON>stringify(user));
      localStorage.removeItem(firebaseAuthKey);
      this.props.history.push("/");
    }
  });
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
