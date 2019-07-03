import React, { useState } from 'react';
import { Menu, MenuItem, Dialog, DialogContent, Typography, DialogActions, Button } from "@material-ui/core";
import { DeleteForever, Edit } from "@material-ui/icons";

export default function TeamMenuComponent(props) {
    const [dialogState, setDialogState] = useState(false)
    const deleteTeam = async () => {
        if (props.team) {
            let response = await fetch(`teams/delete/${props.team._id}`, { method: 'DELETE' });
            let json = await response.json()
            if (json.success) {
                window.location.reload();
            }
        }
    }
    const handler = {
        openDialog: () => {
            setDialogState(true);
        },
        closeDialog: () => {
            setDialogState(false);
        }
    }
    return (
        <div>

            <Menu anchorEl={props.anchor} keepMounted open={Boolean(props.anchor)} onClose={props.onClose}>
                <MenuItem><Edit /> Dummy</MenuItem>
                <MenuItem onClick={handler.openDialog} style={{ color: "red" }}><DeleteForever />Delete</MenuItem>
            </Menu>
            <Dialog open={dialogState}>
                <DialogContent>
                    <Typography variant="h5">Are you sure?</Typography>
                    <Typography variant="body1">This cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handler.closeDialog} color="primary" >No</Button>
                    <Button variant="outlined" onClick={deleteTeam} style={{borderColor:'red',color:'red'}}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
