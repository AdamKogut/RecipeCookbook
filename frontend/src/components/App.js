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
import { connect } from 'react-redux';
import * as actions from '../actions';
import "./App.css";
import history from "../history.js";

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

  componentDidMount(){
    this.props.fetchUser();
  }

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
            <Route path='/cookie' render={()=>{
              document.cookie=`user=${window.location.search.substring(1).split('=')[1]}; expires=${(new Date).getTime()+(7*24*60*60*1000)}`;
              // console.log(document.cookie);
              return <Redirect to="/" />;
              // return null;
            }} />
            <Route path="/" render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(null, actions)(App);
