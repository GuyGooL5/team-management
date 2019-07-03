/* eslint-disable eqeqeq */
import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {CssBaseline} from '@material-ui/core/';


import {LoginPage,HomePage,RegisterPage,LogoutPage, NotFoundPage} from "./pages";

function App(){
  const [authorized, setAuthorized] = useState(null);
  const [user, setUser] = useState(null)

  const checkLogin = async ()=>{
    let data =await  fetch('users/profile')
    if (data.status==200){
      let userData = await data.json();
      setAuthorized(true)
      setUser(userData.user);
    }
  }
  useEffect(()=>{
    checkLogin()
  })
  return (
    <div className="App">
      <CssBaseline/>
        <Router>
          <Switch>
        <Route exact path="/" component={()=><HomePage user={user} isAuthed={authorized}/>}/>
        <Route path="/login" component={()=><LoginPage isAuthed={authorized}/>}/>
        <Route path="/register" component={()=><RegisterPage isAuthed={authorized}/>}/>
        <Route path="/logout" component={()=><LogoutPage isAuthed={authorized}/>}/>
        <Route component={NotFoundPage} />
          </Switch>
      </Router>
    </div>
  )
}

export default App;
