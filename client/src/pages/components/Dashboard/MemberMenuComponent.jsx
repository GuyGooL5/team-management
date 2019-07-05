import React, { useState } from 'react';
import { Menu, MenuItem, Snackbar } from "@material-ui/core";
import { DeleteForever, Edit } from "@material-ui/icons";




export default function MemberMenuComponent({anchor,close,member,team_id,user}) {
    const [snackbarState, setSnackbarState] = useState({open:false,message:''});

    const deleteMember=async ()=>{
        let response =await fetch('/api/teams/removemember',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                "team_id":team_id,
                "member_id":member._id
            })
        })
        let json = await response.json();
        if(json.error){
            openSnackbar(`Error: ${json.error}`);
        }
        if(json.success){
            openSnackbar('Successfuly removed member');
        }
        console.log(json);
    }
        function openSnackbar(message){
            setSnackbarState({ open: true, message: message });
            setInterval(() => { setSnackbarState({ open: false, message: '' }) }, 2000);
    }
    return (
        <div>

            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
                <MenuItem><Edit /> Dummy</MenuItem>
                <MenuItem onClick={deleteMember} style={{ color: "red" }}><DeleteForever />Delete</MenuItem>
            </Menu>

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={snackbarState.open} autoHideDuration={3000}
                    message={<span id="message-id">{snackbarState.message}</span>}
                />
        </div>
    )
}
