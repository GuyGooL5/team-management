import React, { useState, useEffect } from 'react';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@material-ui/core";


function FailDialog(props) {
    return (
        <Dialog {...props}>
            <DialogTitle>A problem occoured</DialogTitle>
            <DialogContent>
                <DialogContentText>There was a problem logging out, try reloading this page.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { window.location.reload(); }} color="primary">Reload</Button>
            </DialogActions>
        </Dialog>
    )

}
export default function LogoutPage() {
    const [dialogStatus, setDialogStatus] = useState(false)

    useEffect(() => {
        performLogout()
    })

    const performLogout = async () => {
        let request = await fetch('users/logout');
        if (request.status === 200) {
            let json = await request.json();
            //When the authentication is complete a dialog will appear that will notify redirecting message.
            if (!json.success && document.cookie.indexOf('token')) {
                setDialogStatus(true);
            }
        } else {
            window.location.href = "/";
        }
    }
    return (
        <FailDialog open={dialogStatus} />
    )
}

