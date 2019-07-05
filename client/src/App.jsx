/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { CssBaseline } from '@material-ui/core/';


import { LoginPage, RegisterPage, NotFoundPage } from "./pages";

import { Dashboard, Navbar, Welcome } from './pages/components';
import SelectedTeamDailog from './pages/components/Dashboard/SelectedTeamDialog';

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
          <Route exact path="/" render={(routerProps)=>authorized?<Dashboard {...routerProps} user={user}/>:<Welcome/>} />
          <Route path="/team/:team_id" render={(routerProps)=>authorized?<SelectedTeamDailog {...routerProps} user={user}/>:null}/>
          <Route path="/login" component={()=>authorized?redirectHome:<LoginPage/>} />
          <Route path="/register" component={()=>authorized?redirectHome:<RegisterPage/>} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </div>
  )
}
