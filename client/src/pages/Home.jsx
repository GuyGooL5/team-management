/* eslint-disable no-useless-constructor */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Dashboard, Welcome } from "./components";

import { AuthData } from "../providers/";
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
export default function HomePage() {
    return (
        <AuthData.Consumer>
            {ctx => {
                let name='';
                if(ctx.user){
                    name=ctx.user.firstname?ctx.user.firstname:ctx.user.username
                }
                return (
                    <div>
                        <AppBar position='static'>
                            <Toolbar>
                                <Typography style={{ flexGrow: 1 }} variant="h6">{`Welcome ${name}`}</Typography>
                                {ctx.isAuthed ? <AuthButtons /> : <NoAuthButtons />}
                            </Toolbar>

                        </AppBar>
                        {ctx.isAuthed ? <Dashboard user={ctx.user} /> : <Welcome />}
                    </div>
                )
            }}
        </AuthData.Consumer>

    )

}
