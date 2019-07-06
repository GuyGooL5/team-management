import React, { useState } from 'react';
import { Menu, MenuItem, Snackbar } from "@material-ui/core";
import { DeleteForever, Edit, Info } from "@material-ui/icons";




export default function MemberMenuComponent({ permission, anchor, close, member, team_id, refreshMembers }) {
    const [snackbarState, setSnackbarState] = useState({ open: false, message: '' });
    const deleteMember = async () => {
        let response = await fetch('/api/teams/removemember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "team_id": team_id,
                "member_id": member._id
            })
        })
        let json = await response.json();
        if (json.error) {
            openSnackbar(`Error: ${json.error}`);
        }
        if (json.success) {
            refreshMembers();
        }
    }
    function openSnackbar(message) {
        setSnackbarState({ open: true, message: message });
        setInterval(() => { setSnackbarState({ open: false, message: '' }) }, 2000);
    }


    const managePermission = async () => {
        let newPermission = (permission === "manager") ? "member" : "manager";
        let response = await fetch('/api/teams/permit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "team_id": team_id,
                "member_id": member._id,
                "permission": newPermission
            })
        });
        let json = await response.json();
        if (json.error) {
            openSnackbar(`Error: ${json.error}`);
        }
        if (json.success) {
            openSnackbar(`The user is now a ${newPermission}`);
            setInterval(() => { window.location.reload() });
        }
    }
    return (
        <div>

            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
                <MenuItem><Info />Info</MenuItem>
                {permission !== "owner" ? <MenuItem onClick={managePermission}><Edit /> {permission === "manager" ? "Demote" : "Promote"}</MenuItem> : null}
                {permission !== "owner" ? <MenuItem onClick={deleteMember} style={{ color: "red" }}><DeleteForever />Delete</MenuItem> : null}
            </Menu>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarState.open} autoHideDuration={3000}
                message={<span id="message-id">{snackbarState.message}</span>}
            />
        </div>
    )
}
