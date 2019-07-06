import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import {
    NewTeamComponent,
    NoTeamsMessage,
    CurrentTeams,
    
 } from "./Dashboard/";

export default function Dashboard (props){
    const [teams, setTeams] = useState([]);

    async function getTeams(){
        if (props.user) {
            let response = await fetch(`/api/teams/find/all`);
            let {teams} = await response.json();
            setTeams(teams);
        }
    }
    useEffect(()=>{
        getTeams();
    },[])

        return (
            <React.Fragment>

            {teams.length?<CurrentTeams refreshTeams={getTeams} user={props.user} teams={teams} />:<NoTeamsMessage />}
            <NewTeamComponent refreshTeams={getTeams}></NewTeamComponent>
            </React.Fragment>

    )
}