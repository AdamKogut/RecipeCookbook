import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Header from './header/Header.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path='/' render = {()=><div>home</div>} />
          <Route path='/saved' render ={()=><div>saved</div>}/>
          <Route path='/grocery' render ={()=><div>grocery</div>}/>
          <Route path='/pantry' render ={()=><div>pantry</div>}/>
          <Route path='/planning' render ={()=><div>planning</div>}/>
        </Switch>
      </div>
    );
  }
}

export default App;
