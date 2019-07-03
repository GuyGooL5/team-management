import React, { useState } from 'react';

import {
    Container,
    Grid,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    InputAdornment,
    IconButton,
    Snackbar
} from "@material-ui/core";

import {
    Visibility,
    VisibilityOff
} from '@material-ui/icons';

import { styled } from '@material-ui/styles';

import { AuthData } from "../providers/";
//text input with custom css features
const TextInput = styled(TextField)({
    margin: '8px',
    width: "100%"
});


function PasswordField() {
    const [peek, setPeek] = useState(false);
    function handleClick(e){
        setPeek(!peek);
    }
    return (
        <TextInput
            variant="outlined"
            type={peek ? "text" : "password"}
            name="password" label="Password" required
            InputProps={
                {
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton onClick={handleClick}>{peek ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                }} />
    )
}
function ErrorSnackbar(props) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={props.open}
            autoHideDuration={3000}
            message={<span>{props.message}</span>} />

    )
}

function SuccessDialog(props){
    return (
        <Dialog {...props}>
            <DialogTitle>Succesfully logged in</DialogTitle>
            <DialogContent>
                <DialogContentText >
                    Redirecting to main page...
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { window.location.replace("/") }} color="primary">Redirect</Button>
            </DialogActions>
        </Dialog>
)
}

export default function LoginPage(props) {
    const [dialogState, setDialogState] = useState(false);
    const [snackbarStatus, setSnackbarStatus] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const submitAction= async (e)=>{
        e.preventDefault();
        let data = new FormData(e.target);
        let body = {}
        for (let [field, value] of data.entries()) {
            body[field] = value;
        }
        let response = await fetch('users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username: body.username, password: body.password })
        });
        let json = await response.json();
        //When the authentication is complete a dialog will appear that will notify redirecting message.
        if (json.success) {
            setDialogState(true);
            setTimeout(() => {
                window.location.replace("/");
            }, 3000);
        } else {
            setSnackbarMessage("Username or password is incorrect")
            setSnackbarStatus(true);
            setTimeout(()=>{setSnackbarStatus(false)},1000);
        }
    }

    function redirect() {
        window.location.href = '/';
    }


        return (
            <AuthData.Consumer>
                {ctx=>
            <div>
                {ctx.isAuthed ? redirect() :
                    <Container className="formClass" maxWidth="sm">
                        <form onSubmit={submitAction}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextInput variant="outlined" type="text" name="username" label="Username" required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <PasswordField />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button color="primary" variant="outlined" style={{ margin: "0.5em" }} type="submit">Login</Button>
                                    <Button color="primary" size="small" variant="text" style={{ margin: "0.5em" }} href="/register">Register</Button>
                                </Grid>
                            </Grid>
                        </form>
                        <SuccessDialog open={dialogState}/>
                        <ErrorSnackbar open={snackbarStatus} message={snackbarMessage} />
                    </Container >
                }
            </div>
                }
                </AuthData.Consumer>
        )
}

 