
import React from 'react';
import "./assets/tailwind/styles.css"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from 'scenes/login/Login';
import Register from 'scenes/register/Register';
import Main from './scenes/main/Main';
import Widget from './scenes/widget/Widget';

import 'react-toastify/dist/ReactToastify.css';

import { isAthenticatedVar, useReactiveVar } from 'graphql/cache'; 


function App() {
  const isAthenticated = useReactiveVar(isAthenticatedVar)
  
  return (
    <>
      <Router>
        <Switch>
          {!isAthenticated &&
          <>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </>}
          {isAthenticated &&
          <>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/widget">
            <Widget />
          </Route>
          </>}
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
