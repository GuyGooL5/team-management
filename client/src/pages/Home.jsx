/* eslint-disable no-useless-constructor */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Dashboard, Welcome } from "./components";

function NoAuthButtons() {
    return (
        <div>
            <Button color="inherit" href="/login">Login</Button>
            <Button color="inherit" href="/register">Register</Button>
        </div>

    )
}
function AuthButtons() {
    return (
        <div>
            <Button color="inherit" href="/logout">Logout</Button>
        </div>

    )
}
function HomePage(props) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (props.user) setName(props.user.firstname ? props.user.firstname : props.user.username);
    },[props.user])

    return (
        <div>
            <AppBar position='static'>
                <Toolbar>
                    <Typography style={{ flexGrow: 1 }} variant="h6">{`Welcome ${name}`}</Typography>
                    {props.isAuthed ? <AuthButtons/> : <NoAuthButtons/>}
                </Toolbar>

            </AppBar>

            {props.isAuthed ? <Dashboard /> : <Welcome />}
        </div>

    )

}
export default HomePage;