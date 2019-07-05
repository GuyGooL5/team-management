
import React, { useState, useEffect } from 'react';
import {
    Popover,
    List,
    ListItem,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    ListItemText,
    CircularProgress,
    Fade,
} from "@material-ui/core";

function Items({ query, select }) {

    const [items, setItems] = useState(null)

    useEffect(() => {
        updateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])


    function updateItems() {
        let array = [];
        if (query.length) {
            for (let i in query) {
                let user = query[i]
                array.push(
                    <ListItem key={i} button onClick={() => select(user)}>
                        <ListItemText primary={user.username} secondary={`${user.firstname ? user.firstname : ''} ${user.lastname ? user.lastname : ''}`} />
                    </ListItem>
                );
            }
        }
        setItems(array);
    }

    return (<List>{items}</List>)
}
export default function NewMemberComponent(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userText, setUserText] = useState('')
    const [snackbarState, setSnackbarState] = useState({ state: false, message: '' });
    const [userResults, setUserResults] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [touched, setTouched] = useState(false)
    const [circularState, setCircularState] = useState(null)
    const handlers = {
        openPopper: (target) => {
            setAnchorEl(target);
        },
        closePopper: () => {
            setAnchorEl(null);
        },
        selectUser: (user) => {
            handlers.closePopper();
            setUserText(user.username);
            setSelectedUser(user);
        },
        clearQuery: () => {
            setUserResults([]);
        }
    }

    function popSnackbar(message) {
        setSnackbarState({ state: true, message: message });
        setInterval(() => {
            setSnackbarState({ state: false, message: '' });
        }, 3000)

    }
    const addNewMember = async (e) => {
        setCircularState(true);
        let response = await fetch('/api/teams/addmember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ team_id: props.team_id, member_id: selectedUser._id })
        });
        let json = await response.json();
        setCircularState(false);
        if (json.error) {
            popSnackbar("Error: " + json.error);
        }
        else if (json.success) {
            popSnackbar("Added new member");
            window.location.reload();
        }
        else popSnackbar('Error proccessing request');
    }
    const findInQuery = async (e) => {
        let target = e.currentTarget;
        setTouched(true);
        let text = e.target.value;
        setUserText(text);
        let req = await fetch(`/api/users/find/${e.target.value}`);
        let json = await req.json();
        if (json.length) {
            handlers.openPopper(target);
            setUserResults(json);
        }
    }
    return (
        <React.Fragment>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarState.state} autoHideDuration={3000}
                message={<span id="message-id">{snackbarState.message}</span>}
            />

            <Dialog maxWidth="sm" fullWidth open={props.open} onClose={handlers.close}>
                <DialogTitle>Add a team member</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Find users by Username, First name or Last name</Typography>
                    <TextField fullWidth style={{ margin: '8px' }} variant="outlined" type="name" name="name" label="Find user" required
                        error={!userResults.length && touched && !selectedUser} value={userText} onChange={findInQuery}
                    />
                    <Popover disableAutoFocus anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handlers.closePopper} onExit={handlers.clearQuery}>
                        <Items query={userResults} select={handlers.selectUser} />
                    </Popover>
                </DialogContent>
                <DialogActions>
                    <Fade in={circularState} unmountOnExit><CircularProgress size={30} /></Fade>
                    <Button disabled={!selectedUser && !circularState} variant="outlined" color="primary" onClick={addNewMember}>Add</Button>
                    <Button variant="outlined" color="primary" onClick={props.close}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
