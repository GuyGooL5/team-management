import React, { useState, useEffect } from 'react';
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
        }
    }

    useEffect(() => {
        getTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])
    return (
        <div>
            {teams.length?<CurrentTeams currentUser={user} teams={teams} />:<NoTeamsMessage />}
            <NewTeamComponent getTeams={getTeams}></NewTeamComponent>

        </div>
    )
}