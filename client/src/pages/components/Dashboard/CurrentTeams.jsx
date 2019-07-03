import React, { useState, useEffect } from 'react';
import {
    Typography,
    Dialog,
    Grid,
    IconButton,
    Container,
    AppBar,
    Toolbar,
    
} from "@material-ui/core";
import { MoreVert, ArrowBack} from "@material-ui/icons";
import {
    TeamMenuComponent,
    MemberItem,
    TeamCard
 } from './'

export default function CurrentTeams(props) {

    const [teamCards, setTeamCards] = useState(null);
    const [memberItems, setMemberItems] = useState(null);
    const [fullDialogState, setFullDialogState] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(props.teams[0])
    useEffect(() => {
        if(props.teams){
            populateCards()
        }
    }, [props.teams]);
    const handlers={
        menuClose:()=>{
            setAnchorEl(null);
        },
        menuOpen:(e)=>{
            setAnchorEl(e.currentTarget);
        },
        dialogClose:()=>{
            setFullDialogState(false);
        },
        //need to come back here later////////////////
        dialogOpen:(i)=>{
            setSelectedTeam(props.teams[i]);
            populateMembers(props.teams[i]['members'])
            setFullDialogState(true);
        }
    }
    function populateCards() {
        if (props.teams) {
            let teamCards = [];
            for (let i in props.teams) {
                teamCards.push(
                    <Grid _id={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <TeamCard expand={handlers.dialogOpen} team={props.teams[i]} />
                    </Grid>
                )
            }
            setTeamCards(teamCards);
        }
    }

    function populateMembers(members) {
        if (members) {
            let membersArray = [];
            for (let i in members) {
                membersArray.push(
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <MemberItem _id={i} member={members[i]} />
                    </Grid>
                )
            }
            setMemberItems(membersArray);
        }
    }

    return (
        <div>
            <Container >
                <Typography style={{ margin: '8px' }} variant="h5">Review your teams.</Typography>
            </Container>
            <Grid style={{ margin: '8px' }} container spacing={3}>
                {teamCards}
            </Grid>
            {/* -----------------Dialog starts here--------------- */}
            <Dialog fullWidth fullScreen open={fullDialogState}>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handlers.dialogClose}><ArrowBack /></IconButton>
                        <Typography variant="h5" style={{ flexGrow: 1 }}>Team Management Window</Typography>
                        <IconButton edge="end" color="inherit" onClick={handlers.menuOpen}><MoreVert /></IconButton>
                    </Toolbar>
                </AppBar>
                <TeamMenuComponent anchor={anchorEl} team={selectedTeam} onClose={handlers.menuClose} onClick={handlers.menuClose}/>
                <Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography></Typography>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    )
}
