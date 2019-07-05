/* eslint-disable no-useless-constructor */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { AuthData } from "../../providers";
import { Home } from '@material-ui/icons';



function NoAuthButtons() {
    return (
        <div>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
        </div>

    )
}
function AuthButtons(props) {
    return (
        <div>
            <Button color="inherit" onClick={props.performLogout}>Logout</Button>
        </div>

    )
}

function LogoutDialog(props) {
    return (
        <Dialog {...props}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { window.location.reload(); }} color="primary">Reload</Button>
            </DialogActions>
        </Dialog>
    )

}
export default function Navbar({ isAuthed, user }) {
    const [dialogProps, setDialogProps] = useState({ open: false })
    const name = isAuthed?user.firstname?user.firstname:user.username:'Guest';
    const performLogout = async () => {
        let request = await fetch('/api/users/logout');
        if (request.status === 200) {
            let json = await request.json();
            //When the authentication is complete a dialog will appear that will notify redirecting message.
            if (!json.success && document.cookie.indexOf('token')) {
                setDialogProps({ open: true, title: "Error while logging out", text: "Some error occoured trying logging out please reload this page." });
            }
            else {
                setDialogProps({ open: true, title: "Successfully logged out", text: "Please reload the page or wait." });
                setInterval(() => { window.location.reload() }, 2000);
            }

        } else {
            window.location.reload();
        }
    }
    return (
        <div>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" component={Link} to="/"><Home/></IconButton>
                    <Typography style={{ flexGrow: 1 }} variant="h6">{`Welcome ${name}`}</Typography>
                    {isAuthed ? <AuthButtons performLogout={performLogout} /> : <NoAuthButtons />}
                </Toolbar>

            </AppBar>
            <LogoutDialog {...dialogProps} />
        </div>
    )

}
