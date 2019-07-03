/* eslint-disable react/jsx-no-duplicate-props */
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
    Typography
} from "@material-ui/core";

import {
    Visibility,
    VisibilityOff
} from '@material-ui/icons';

import { styled, ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { AuthData } from "../providers/";

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

//text input with custom css features
const TextInput = styled(TextField)({
    margin: '8px',
    width: "100%"
});

//Password input wrapper
function PassowrdInput() {
    const [peek, setPeek] = useState(false);
    const [touched, touch] = useState(false);
    const [valid, setValidity] = useState(true);

    function validatePasswordPattern(e) {
        setValidity(e.target.validity.valid);
        touch(!!e.target.value);
    }

    function togglePeek() {
        setPeek(!peek);
    }
    return (
        <ThemeProvider theme={touched && valid ? theme : null}>
            <TextInput
                variant="outlined" color="primary" name="password" label="Password" required
                onChange={validatePasswordPattern}
                error={!valid}
                type={peek ? "text" : "password"}
                inputProps={{ pattern: "^([a-zA-Z0-9!@#$%^&*]{8,15})$" }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton onClick={togglePeek}>{peek ? <Visibility /> : <VisibilityOff />}</IconButton>
                        </InputAdornment>
                }}
                helperText="Must be 8-15 characters long and contain letters, numbers or symbols."
            />
        </ThemeProvider>
    )

}

function ValidationField(props) {
    const [touched, touch] = useState(false);

    const [fieldValid, updateFieldValidity] = useState(true);
    const [fieldMessage, updateMessage] = useState(null);

    const validateFieldNotTaken = async (e) => {
        touch(!!e.target.value);
        e.persist();

        //reset custom validity check
        e.target.setCustomValidity("");
        //for efficiency it validates only if the email format is correct.
        if (e.target.validity.valid) {
            //awaiting response in json form from the server
            let json = await (await fetch('users/validate', {
                body: JSON.stringify({ [e.target.name]: e.target.value }),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })).json();
            if (json.success !== undefined) {
                updateFieldValidity(json.success);
                updateMessage(json.msg);

                if (!json.success) {
                    //if the response is false then the email/username is already taken.
                    e.target.setCustomValidity(`Please select another ${e.target.name}`);
                }
            }
        } else {
            updateFieldValidity(false);
            if (props.name === 'username') updateMessage('Must be 2-15 characters long and contain letters and numbers only')
            else if (props.name === 'email') updateMessage('Incorrect e-mail pattern');
            // if (e.target.name === 'email') this.setState({ emailValid: false, emailMessage: `Incorrect e-mail pattern` });
            // else if (e.target.name === 'username') this.setState({ usernameValid: false, usernameMessage: `Must be 2-15 characters long and contain letters and numbers only.` });
        }
    }

    return (
        <ThemeProvider theme={touched && fieldValid ? theme : null}>
            <TextInput
                variant="outlined" type={props.type} name={props.name} label={props.label} required
                onChange={validateFieldNotTaken}
                error={!fieldValid}
                inputProps={{ pattern: props.pattern }}
                helperText={fieldMessage}
            />
        </ThemeProvider>
    )
}

function SuccessDialog(props) {
    return (
        <Dialog {...props} >
            <DialogTitle>User Created Successfully</DialogTitle>
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

export default function RegisterPage(props) {
    const [dialogState, updateDialogState] = useState(false);
    const [errorMessage, updateErrorMessage] = useState(false);

    const submitAction = async (e) => {
        e.preventDefault();
        let data = new FormData(e.target);
        let body = {}
        for (let [field, value] of data.entries()) {
            body[field] = value;
        }
        let response = await fetch('http://localhost:3300/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });
        let json = await response.json();

        if (json.success) {
            authenticate(body.username, body.password);
        }
    }

    const authenticate = async (username, password) => {
        let response = await fetch('users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });
        let json = await response.json();
        //When the authentication is complete a dialog will appear that will notify redirecting message.
        if (json.success) {
            updateDialogState(true);
            setTimeout(() => {
                window.location.replace("/");
            }, 3000);
        } else {
            updateErrorMessage("Authentication error accoured, try reloading the page.");
        }
    }
    function redirect(){
        console.log('meh');
        window.location.href='/';
    }
    return (
        <AuthData.Consumer>
            {ctx=>
        <div>
        {ctx.isAuthed?redirect():
        <Container maxWidth="sm">
            <form onSubmit={submitAction}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} >
                        <TextInput variant="outlined" type="text" name="firstName" label="First Name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextInput variant="outlined" type="text" name="lastName" label="Last Name" />
                    </Grid>
                    <Grid item xs={12}>
                        <ValidationField name="email" label="Email" type="email" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ValidationField name="username" label="Username" type="text" pattern="^[A-Za-z0-9_]{2,15}$" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <PassowrdInput />
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="primary" variant="outlined" style={{ margin: "0.5em" }} type="submit">Register</Button>
                        <Button color="primary" size="small" variant="text" style={{ margin: "0.5em" }} href="/login">Login</Button>
                    </Grid>
                </Grid>
            </form>
            <SuccessDialog open={dialogState} />
            <Typography variant="subtitle1" style={{ color: "red" }}>{errorMessage}</Typography>
        </Container >}
    </div>
    }
    </AuthData.Consumer>
    )
}
