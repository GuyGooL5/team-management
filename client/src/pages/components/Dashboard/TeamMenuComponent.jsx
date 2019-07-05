import React, { useState } from 'react';
import { Menu, MenuItem, Dialog, DialogContent, Typography, DialogActions, Button, Snackbar, LinearProgress } from "@material-ui/core";
import { DeleteForever, Edit } from "@material-ui/icons";




export default function TeamMenuComponent(props) {
    const [dialogState, setDialogState] = useState(false)
    const [deleteInProgress,setDeleteInProgress] = useState(false);
    const [snackbarState, setSnackbarState] = useState({ open: false, message: '' })
    const deleteTeam = async () => {
        if (props.team) {
            setDeleteInProgress(true);
            let response = await fetch(`/api/teams/delete/${props.team._id}`, { method: 'DELETE' });
            let json = await response.json()
            if (json.success) {
                setDialogState(false);
                handlers.openSnackbar('Team deleted succesfully, reloading.')
                setInterval(() => window.location.href="/", 1000);
                setDeleteInProgress(false);
            } else {
                setDialogState(false);
                setDeleteInProgress(false);
                handlers.openSnackbar('Error deleting team.');
            }
        }
    }
    const handlers = {
        openDialog: () => {
            setDialogState(true);
        },
        closeDialog: () => {
            setDialogState(false);
        },
        openSnackbar: (message) => {
            setSnackbarState({ open: true, message: message });
            setInterval(() => { setSnackbarState({ open: false, message: '' }) }, 2000);
        }
    }
    const dialogMessage = <Dialog open={dialogState}>
        <DialogContent>
            <Typography variant="h5">Are you sure?</Typography>
            <Typography variant="body1">This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handlers.closeDialog} color="primary" >No</Button>
            <Button variant="outlined" onClick={deleteTeam} style={{ borderColor: 'red', color: 'red' }}>Yes</Button>
        </DialogActions>
    </Dialog>

    const loadingMessage=<Dialog open={dialogState}>
        <DialogContent>
            <Typography variant="h5">Deleting team.</Typography>
            <LinearProgress></LinearProgress>
        </DialogContent>
    </Dialog>

    return (
        <div>

            <Menu anchorEl={props.anchor} keepMounted open={Boolean(props.anchor)} onClose={props.close}>
                <MenuItem><Edit /> Dummy</MenuItem>
                <MenuItem onClick={handlers.openDialog} style={{ color: "red" }}><DeleteForever />Delete</MenuItem>
            </Menu>
            {deleteInProgress?loadingMessage:dialogMessage}
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={snackbarState.open} autoHideDuration={3000}
                    message={<span id="message-id">{snackbarState.message}</span>}
                />
        </div>
    )
}
