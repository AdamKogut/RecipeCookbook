import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {purple, green} from '@material-ui/core/colors';
import Header from "./header/Header.js";
import "./App.css";

class App extends Component {
  theme = createMuiTheme({
    palette: {
      primary: purple,
      secondary: green,
    },
    status: {
      danger: 'orange',
    },
  });

  render() {
    return (
      <MuiThemeProvider theme={this.theme}>
        <Header />
        <Switch>
          <Route exact path="/" render={() => <div>home</div>} />
          <Route path="/saved" render={() => <div>saved</div>} />
          <Route path="/grocery" render={() => <div>grocery</div>} />
          <Route path="/pantry" render={() => <div>pantry</div>} />
          <Route path="/planning" render={() => <div>planning</div>} />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default App;
