/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CssBaseline } from '@material-ui/core/';


import { LoginPage, HomePage, RegisterPage, LogoutPage, NotFoundPage } from "./pages";

import { AuthData } from "./providers/index";

export default function App() {
  const [authorized, setAuthorized] = useState(null);
  const [user, setUser] = useState(null)

  const checkLogin = async () => {
    let data = await fetch('users/profile')
    if (data.status == 200) {
      let userData = await data.json();
      setAuthorized(true)
      setUser(userData.user);
    }
  }
  useEffect(() => {
    checkLogin();
  }, [])
  return (

    <div className="App">
      <CssBaseline />

      <AuthData.Provider value={{ isAuthed: authorized, user: user }}>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/logout" component={LogoutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </AuthData.Provider>
    </div>
  )
}
