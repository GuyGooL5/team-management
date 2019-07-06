import React, { useState, useEffect } from 'react';
import { Dialog, AppBar, Toolbar, List, Typography, IconButton, DialogContent, Fab } from "@material-ui/core";
import { ArrowBack, MoreVert, PersonAdd } from "@material-ui/icons";

import { TeamMenuComponent, MemberItem } from "./";
import NewMemberComponent from './NewMemberComponent';

export default function SelectedTeamDailog({ user, team_id, close, refreshTeams }) {
    const [memberItems, setMemberItems] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [newMemberDialog, setNewMemberDialog] = useState(false)
    const [team, setTeam] = useState({})
    const [dialogState, setDialogState] = useState(false)
    useEffect(() => {
        getTeamDetails()
        //reset states upon unmount
        return(resetStates);
    }, [team_id]);

    function resetStates(){
        setAnchorEl(null);
        setNewMemberDialog(false);
        setMemberItems(null);
        setTeam({});
    }

    const getTeamDetails = async (e) => {
        resetStates();
        if(team_id){
            let res = await fetch(`/api/teams/find/team/${team_id}`);
            let json = await res.json();
            if (json.success) {
                setTeam(json.team);
                populateMembers(json.team.members);
                setDialogState(true);
            }
            else {
                setDialogState(false);
            }
        }else setDialogState(false);
    }

    function populateMembers(members) {
        if (members) {
            let membersArray = [];
            for (let i in members) {
                membersArray.push(
                    <MemberItem refreshMembers={getTeamDetails} key={i} team_id={team_id} user={user} member={members[i]} isLast={(members.length - 1) === i} />
                )
            }
            setMemberItems(membersArray);
        }
    }

    const handlers = {
        teamDelete:()=>{
            setDialogState(false);
            refreshTeams();
        },
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
        <Dialog fullWidth  open={dialogState}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={close}><ArrowBack /></IconButton>
                    <Typography variant="h5" style={{ flexGrow: 1 }}>Team Management</Typography>
                    <IconButton edge="end" color="inherit" onClick={handlers.menuOpen}><MoreVert /></IconButton>
                </Toolbar>
            </AppBar>
            <TeamMenuComponent onDelete={handlers.teamDelete} anchor={anchorEl} team={team} user={user} close={handlers.menuClose} onClick={handlers.menuClose} />
                <DialogContent>
                    <Typography variant="h4">{team.name}</Typography>
                    <Typography variant="h6">{team.description}</Typography>
                    <List style={{ maxWidth: "512px" }}>
                        {memberItems}
                    </List>
                    <Fab color="secondary" style={{ position: 'fixed', right: '50%', bottom: '16px' }} onClick={handlers.newDialogOpen}><PersonAdd /></Fab>
                    <NewMemberComponent refreshMembers={getTeamDetails} close={handlers.newDialogClose} team_id={team_id} open={newMemberDialog} />
                </DialogContent>
        </Dialog>
    )
}