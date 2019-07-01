/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { AppBar,Toolbar, IconButton, Typography, Button } from "@material-ui/core";
import { BrowserRouter as Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";

class Navbar extends React.Component{

    render(){
        return(
        <AppBar position='static'>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="Menu"><MenuIcon/></IconButton>
                <Typography variant="h6">Welcome</Typography>
                <Button color="inherit" href="/login">Login</Button>
                <Button color="inherit" href="/register">Register</Button>
            </Toolbar>

        </AppBar>


        )
        }
}

export default Navbar;