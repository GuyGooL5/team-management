import React from 'react';

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

import { styled } from '@material-ui/styles';

//text input with custom css features
const TextInput = styled(TextField)({
    margin: '8px',
    width: "100%"
});

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        //binding the class fuctions to the state property
        this.handleTogglePasswordView = this.handleTogglePasswordView.bind(this);
        this.validateFieldNotTaken = this.validateFieldNotTaken.bind(this);
        this.submitAction = this.submitAction.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.state = {
            emailValid: true,
            emailMessage: null,
            usernameValid: true,
            usernameMessage: null,
            passwordPeekState: false,
            dialogMessage: null
        }
    }
    //handles password peek visibility
    handleTogglePasswordView() {
        this.setState({ passwordPeekState: !this.state.passwordPeekState });
    }

    //checks if an email or username are free to use or already taken
    async validateFieldNotTaken(e) {
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
                this.setState({ [e.target.name + "Valid"]: json.success, [e.target.name + "Message"]: json.msg });
                if (!json.success) {
                    //if the response is false then the email/username is already taken.
                    e.target.setCustomValidity(`Please select another ${e.target.name}`);
                }
            }
        } else {
            this.setState({ [e.target.name + "Valid"]: false, [e.target.name + "Message"]: "Incorrect Email format." });
        }
    }

    async submitAction(e) {
        e.preventDefault();
        let data = new FormData(e.target);
        let requestBody = {}
        for (let [field, value] of data.entries()) {
            requestBody[field] = value;
        }
        let response = await fetch('http://localhost:3300/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        let json = await response.json();

        if (json.success) {
            this.authenticate(requestBody.username, requestBody.password);
        }
    }

    async authenticate(username, password) {
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
            let successDialog =
                <Dialog open>
                    <DialogTitle>User Created Successfully</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            Redirecting to main page...
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{window.location.replace("/")}} color="primary">Redirect</Button>
                    </DialogActions>
                </Dialog>;

            this.setState({ dialogMessage: successDialog });

            setTimeout(() => {
                window.location.replace("/");
            }, 3000);
        } else {
            this.setState({ errorMessage: "Authentication error accoured, try reloading the page." });
        }
    }
    render() {
        return (
            <Container className="formClass" maxWidth="sm">
                <form onSubmit={this.submitAction}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} >
                            <TextInput variant="outlined" type="text" name="firstName" label="First Name" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextInput variant="outlined" type="text" name="lastName" label="Last Name" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextInput onChange={this.validateFieldNotTaken} variant="outlined" type="email" name="email" label="Email" error={!this.state.emailValid} helperText={this.state.emailMessage} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextInput onChange={this.validateFieldNotTaken} variant="outlined" type="text" name="username" label="Username" error={!this.state.usernameValid} helperText={this.state.usernameMessage} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextInput variant="outlined" type={this.state.passwordPeekState ? "text" : "password"} name="password" label="Password" required InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={this.handleTogglePasswordView}>{this.state.passwordPeekState ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button color="primary" variant="outlined" style={{ margin: "0.5em" }} type="submit">Register</Button>
                            <Button color="primary" size="small" variant="text" style={{ margin: "0.5em" }} href="/login">Login</Button>
                        </Grid>
                    </Grid>
                </form>
                {this.state.dialogMessage}
                <Typography variant="subtitle1" style={{ color: "red" }}>{this.state.errorMessage}</Typography>
            </Container >
        )
    }
}

export default RegisterPage;