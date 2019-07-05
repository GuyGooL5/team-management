
import React, { useState } from 'react';
import {
    Grid,
    Fab,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Fade,
    CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Create } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    danger: {
        '&:hover': {
            color: 'red',
            borderColor: 'red'
        }
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}))



export default function NewTeamComponent(props) {
    const classes = useStyles();
    const [dialogState, setDialogState] = useState(false);
    const [circularState, setCircularState] = useState(false);
    const [snackbarStatus, setSnackbarStatus] = useState(false)
    const [snackbarState, setSnackbarState] = useState({state:false,message:''});

    const handlers={
        clickOpen:()=>{
            setDialogState(true);
        },
        close:()=>{
            setDialogState(false);
        }
    }
    function popSnackbar(message) {
        setSnackbarState({state:true,message:message});
        setInterval(() => {
            setSnackbarState({state:false,message:''});
        }, 3000)

    }
    const submitAction = async (e) => {
        e.preventDefault();
        let data = new FormData(e.target);
        let body = {}
        for (let [key, value] of data.entries()) {
            body[key] = value;
        }
        setCircularState(true);
        let req = await fetch('/api/teams/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        })
        let json = await req.json();
        if (json.success) {
            setDialogState(false);
            setCircularState(false);
            popSnackbar('Team created successfully')
            props.getTeams();

        }
        else if (json.error) {
            setCircularState(false);
            popSnackbar(`Error: ${json.error}`);
        }
        else {
            setCircularState(false);
            popSnackbar('Error creating new Team');
        }
    }
    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarState.state} autoHideDuration={3000}
                message={<span id="message-id">{snackbarState.message}</span>}
            />
            <Fab onClick={handlers.clickOpen} className={classes.fab} color='secondary' aria-label="Create"><Create /></Fab>
            <Dialog open={dialogState} onClose={handlers.close}>
                <form onSubmit={submitAction}>
                    <DialogTitle>Create a team</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Go ahead Create a team and start managing.</Typography>
                        <Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth style={{ margin: '8px' }} variant="outlined" type="name" name="name" label="Team name" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth style={{ margin: '8px' }} multiline rows={3} variant="outlined" type="text" name="description" label="Description" />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Fade in={circularState} unmountOnExit><CircularProgress size={30} /></Fade>
                        <Button variant="outlined" color="primary" type="submit" disabled={circularState}>Create</Button>
                        <Button variant="outlined" onClick={handlers.close} className={classes.danger}>Discard</Button>
                    </DialogActions>
                </form>
            </Dialog>


        </div>
    )
}
