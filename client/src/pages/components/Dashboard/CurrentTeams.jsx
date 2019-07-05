import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
    SelectedTeamDialog,
    MemberItem,
    TeamCard
 } from './'

export default function CurrentTeams(props) {

    const [teamCards, setTeamCards] = useState(null);
    const [userAsMember,setUserAsMember] = useState(props.currentUser);
    const [fullDialogState, setFullDialogState] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null)
    useEffect(() => {
        if(props.teams){
            populateCards()
        }
    }, [props.teams]);

    const handlers={
        dialogClose:()=>{
            setFullDialogState(false);
            setSelectedTeam(null);
        },
        //need to come back here later////////////////
        dialogOpen:(i)=>{
            setSelectedTeam(props.teams[i]);
            setFullDialogState(true);
        }
    }

    function populateCards() {
        if (props.teams) {
            let teamCards = [];
            for (let i in props.teams) {
                teamCards.push(
                    <Grid style={{padding:'8px'}} key={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <TeamCard key={i} index={i} team={props.teams[i]} />
                    </Grid>
                )
            }
            setTeamCards(teamCards);
        }
    }



    return (
        <div>
            <Container >
                <Typography style={{ margin: '8px' }} variant="h5">Review your teams.</Typography>
            </Container>
            <Grid container spacing={0}>
                {teamCards}
            </Grid>
            {/* -----------------Dialog starts here--------------- */}
            <Router>
                <Route path="/team/:id" component={()=><SelectedTeamDialog currentUser={props.currentUser} close={handlers.dialogClose} open={fullDialogState} selectedTeam={selectedTeam}/>}></Route>
            </Router>
        </div>
    )
}
