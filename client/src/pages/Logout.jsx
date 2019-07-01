import React from 'react';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@material-ui/core";
//text input with custom css features
class LogoutPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogMessage: null
        }
    }
    //handles password peek visibility

    componentDidMount() {
        this.performLogout();
    }
    async performLogout() {
        let request = await fetch('users/logout');
        if (request.status == 200) {
            let json = await request.json();
            //When the authentication is complete a dialog will appear that will notify redirecting message.
            if (!json.success && document.cookie.indexOf('token')) {
                let failDialog =
                    <Dialog open>
                        <DialogTitle>A problem occoured</DialogTitle>
                        <DialogContent>
                            <DialogContentText >
                                There was a problem logging out, try reloading this page.
                    </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { window.location.reload(); }} color="primary">Reload</Button>
                        </DialogActions>
                    </Dialog>;
                this.setState({ dialogMessage: failDialog });
            }
        } else {
            window.location.href = "/";
        }
    }
    render() {
        return (
            <div>
                {this.state.dialogMessage}
            </div>
        )
    }
}

export default LogoutPage;