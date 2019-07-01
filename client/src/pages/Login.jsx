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
    Snackbar
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

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        //binding the class fuctions to the state property
        this.handleTogglePasswordView = this.handleTogglePasswordView.bind(this);
        this.closeSnackbar=this.closeSnackbar.bind(this);
        this.submitAction = this.submitAction.bind(this);
        this.state = {
            passwordPeekState: false,
            dialogMessage: null
        }
    }
    //handles password peek visibility
    handleTogglePasswordView() {
        this.setState({ passwordPeekState: !this.state.passwordPeekState });
    }
    closeSnackbar(state){
        this.setState({snackBarOpen:false});
    }
    async submitAction(e) {
        e.preventDefault();
        let data = new FormData(e.target);
        let requestBody = {}
        for (let [field, value] of data.entries()) {
            requestBody[field] = value;
        }
        let response = await fetch('users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username: requestBody.username, password: requestBody.password })
        });
        let json = await response.json();
        //When the authentication is complete a dialog will appear that will notify redirecting message.
        if (json.success) {
            let successDialog =
                <Dialog open>
                    <DialogTitle>Succesfully logged in</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            Redirecting to main page...
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { window.location.replace("/") }} color="primary">Redirect</Button>
                    </DialogActions>
                </Dialog>;

            this.setState({ dialogMessage: successDialog });

            setTimeout(() => {
                window.location.replace("/");
            }, 3000);
        } else {
            this.setState({snackBarOpen:true,errorMessage: "Username or password is incorrect." });
        }
    }
    render() {
        return (
            <Container className="formClass" maxWidth="sm">
                <form onSubmit={this.submitAction}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextInput variant="outlined" type="text" name="username" label="Username" required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextInput variant="outlined" type={this.state.passwordPeekState ? "text" : "password"} name="password" label="Password" required InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={this.handleTogglePasswordView}>{this.state.passwordPeekState ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button color="primary" variant="outlined" style={{ margin: "0.5em" }} type="submit">Login</Button>
                            <Button color="primary" size="small" variant="text" style={{ margin: "0.5em" }} href="/register">Register</Button>
                        </Grid>
                    </Grid>
                </form>
                {this.state.dialogMessage}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.closeSnackbar}
                    message={<span>{this.state.errorMessage}</span>}/>
            </Container >
        )
    }
}

export default LoginPage;