import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {purple, green} from '@material-ui/core/colors';
import Header from "./header/Header.js";
import mainSaved from './saved/mainSave';
import mainPlanning from './planning/mainPlanning';
import mainGrocery from './grocery/mainGrocery';
import mainHome from './home/mainHome';
import mainPantry from './pantry/mainPantry';
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
          <Route exact path="/" render={() => <mainHome />} />
          <Route path="/saved" render={() => <mainSaved />} />
          <Route path="/grocery" render={() => <mainGrocery />} />
          <Route path="/pantry" render={() => <mainPantry />} />
          <Route path="/planning" render={() => <mainPlanning />} />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default App;
