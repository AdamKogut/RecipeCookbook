import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import  serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { Router, BrowserRouter } from "react-router-dom";
import reducers from "./reducers";
import history from "./history";

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <BrowserRouter history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker();
