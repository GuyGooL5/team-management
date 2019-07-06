import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
    Typography,
    Grid,
    Container
} from "@material-ui/core";
import {
    SelectedTeamDialog,
    TeamCard
 } from './'

export default function CurrentTeams(props) {

    const [teamCards, setTeamCards] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null)
    
    useEffect(() => {
        if (props.teams) {
            populateTeamCards(props.teams);
        }
    }, [props.teams]);

    function populateTeamCards(teams){
        let cards = [];
        for (let i in teams) {
            cards.push(
                <Grid style={{padding:'8px'}} key={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <TeamCard key={i} setTeamId={handlers.dialogOpen} index={i} team={teams[i]} />
                </Grid>
            )
        }
        setTeamCards(cards);

    }

    const handlers={
        dialogClose:()=>{
            setSelectedTeam(null);
        },
        //need to come back here later////////////////
        dialogOpen:(id)=>{
            setSelectedTeam(id);
        }
    }

    return (
        <React.Fragment>
            <Container >
                <Typography style={{ margin: '8px' }} variant="h5">Review your teams.</Typography>
            </Container>
            <Grid container spacing={0}>
                {teamCards}
            </Grid>
            {selectedTeam?<SelectedTeamDialog refreshTeams={props.refreshTeams} user={props.user} close={handlers.dialogClose} team_id={selectedTeam}/>:null}
        </React.Fragment>
    )
}
