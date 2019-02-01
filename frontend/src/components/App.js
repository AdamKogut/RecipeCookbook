import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { purple, green } from "@material-ui/core/colors";
import Header from "./header/Header.js";
import MainSaved from "./saved/mainSave";
import MainPlanning from "./planning/mainPlanning";
import MainGrocery from "./grocery/mainGrocery";
import MainHome from "./home/mainHome";
import MainPantry from "./pantry/mainPantry";
import "./App.css";

class App extends Component {
  theme = createMuiTheme({
    palette: {
      primary: purple,
      secondary: green
    },
    status: {
      danger: "orange"
    }
  });

  render() {
    return (
      <MuiThemeProvider theme={this.theme}>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" render={() => <MainHome />} />
            <Route path="/saved" render={() => <MainSaved />} />
            <Route path="/grocery" render={() => <MainGrocery />} />
            <Route path="/pantry" render={() => <MainPantry />} />
            <Route path="/planning" render={() => <MainPlanning />} />
            <Route path="/" render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
