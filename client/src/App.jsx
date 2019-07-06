/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { CssBaseline } from '@material-ui/core/';


import { LoginPage, RegisterPage, NotFoundPage } from "./pages";

import { Dashboard, Navbar, Welcome } from './pages/components';

export default function App() {
  const [authorized, setAuthorized] = useState(null);
  const [user, setUser] = useState({})

  const redirectHome=<Redirect to="/"/>
  const checkLogin = async () => {
    let data = await fetch('/api/users/profile')
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
      <Router>

          <Navbar isAuthed={authorized} user={user}>
          </Navbar>


        <Switch>
          <Route exact path="/" render={()=>authorized?<Redirect to="/dashboard"/>:<Welcome/>} />
          <Route path="/dashboard" render={(routerProps)=>authorized?<Dashboard keepMounted {...routerProps} authorized={authorized} user={user}/>:<Redirect to="/"/>}/>
          <Route path="/login" component={()=>authorized?redirectHome:<LoginPage/>} />
          <Route path="/register" component={()=>authorized?redirectHome:<RegisterPage/>} />
          {/* <Route component={NotFoundPage} /> */}
        </Switch>
      </Router>
    </div>
  )
}
