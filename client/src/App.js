/* eslint-disable eqeqeq */
import React from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {CssBaseline} from '@material-ui/core/';


import {LoginPage,HomePage,RegisterPage,LogoutPage, NotFoundPage} from "./pages";

class App extends React.Component{
  constructor(){
    super();
    this.checkLogin = this.checkLogin.bind(this);
    this.state={
      autherized:null,
      user:null
    }
  }

  async checkLogin(){
    let data =await  fetch('users/profile')
    if (data.status==200){
      let userData = await data.json();
      this.setState({autherized:true,user:userData.user});
    }
  }
  componentWillMount(){
    this.checkLogin()
  }
  render(){
  return (
    <div className="App">
      <CssBaseline/>
        <Router>
          <Switch>
        <Route exact path="/" component={()=><HomePage user={this.state.user} isAuthed={this.state.autherized}/>}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/register" component={RegisterPage}/>
        <Route path="/logout" component={()=><LogoutPage isAuthed={this.state.autherized}/>}/>
        <Route component={NotFoundPage} />
          </Switch>
      </Router>
    </div>
  );
  }
}

export default App;
