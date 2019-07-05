import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Dialog, AppBar, Toolbar, List, Typography, IconButton, DialogContent, Button, Fab, DialogTitle, DialogActions } from "@material-ui/core";
import { ArrowBack, MoreVert, PersonAdd } from "@material-ui/icons";

import { TeamMenuComponent, MemberItem } from "./";
import NewMemberComponent from './NewMemberComponent';

export default function SelectedTeamDailog({ match, user }) {
    const [dialogStatus, setDialogStatus] = useState(null)
    const [memberItems, setMemberItems] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [newMemberDialog, setNewMemberDialog] = useState(false)
    const [team, setTeam] = useState({})
    //useEffect(populateMembers, [props.selectedTeam.members]);
    useEffect(() => {
        getTeamDetails();
    }, []);

    const getTeamDetails = async (e) => {
        let res = await fetch(`/api/teams/find/team/${match.params.team_id}`);
        let json = await res.json();
        console.log(json);
        if (json.success) {
            setTeam(json.team);
            populateMembers(json.team.members);
            setDialogStatus(true);
        }
        else {
            setDialogStatus(false);
        }
    }

    function populateMembers(members) {
        if (members) {
            let membersArray = [];
            for (let i in members) {
                membersArray.push(
                    <MemberItem key={i} team_id={match.params.team_id} currentUser={user} member={members[i]} isLast={(members.length - 1) == i} />
                )
            }
            setMemberItems(membersArray);
        }
    }

    const handlers = {
        menuOpen: (e) => {
            setAnchorEl(e.currentTarget);
        },
        menuClose: () => {
            setAnchorEl(null);
        },
        newDialogOpen: () => {
            setNewMemberDialog(true);
        },
        newDialogClose: () => {
            setNewMemberDialog(false);
        }
    }

    return (
        <Dialog fullWidth fullScreen open>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" component={Link} to="/"><ArrowBack /></IconButton>
                    <Typography variant="h5" style={{ flexGrow: 1 }}>Team Management</Typography>
                    {dialogStatus ? <IconButton edge="end" color="inherit" onClick={handlers.menuOpen}><MoreVert /></IconButton> : null}
                </Toolbar>
            </AppBar>
            <TeamMenuComponent anchor={anchorEl} team={team} close={handlers.menuClose} onClick={handlers.menuClose} />
            {dialogStatus ?
                <DialogContent>
                    <Typography variant="h4">{team.name}</Typography>
                    <Typography variant="h6">{team.description}</Typography>
                    <List style={{ maxWidth: "512px" }}>
                        {memberItems}
                    </List>
                    <Fab color="secondary" style={{ position: 'fixed', right: '50%', bottom: '16px' }} onClick={handlers.newDialogOpen}><PersonAdd /></Fab>
                    <NewMemberComponent close={handlers.newDialogClose} team_id={match.params._id} open={newMemberDialog} />
                </DialogContent> :
                <DialogContent>
                    <Typography>This team doesn't exist.</Typography>
                    <Button variant="outlined" color="primary" component={Link} to="/">Home</Button>
                </DialogContent>
            }
        </Dialog>
    )
}