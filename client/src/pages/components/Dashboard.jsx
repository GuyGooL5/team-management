import React, { useState, useEffect } from 'react';
import { BrowserRouter as Route } from "react-router-dom";
import {
    NewTeamComponent,
    NoTeamsMessage,
    CurrentTeams,
    
 } from "./Dashboard/";





export default function Dashboard({match,user}) {

    const [teams, setTeams] = useState([]);

    const getTeams = async () => {
        if (user) {
            let response = await fetch(`/api/teams/find/all`);
            let {teams} = await response.json();
            setTeams(teams);
        } else return null;
    }

    useEffect(() => {
        getTeams();
    },[user])
    return (
        <div>
            {teams.length?<CurrentTeams currentUser={user} teams={teams} />:<NoTeamsMessage />}
            <NewTeamComponent getTeams={getTeams}></NewTeamComponent>

        </div>
    )
}