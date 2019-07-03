import React, { useState, useEffect } from 'react';

import {
    NewTeamComponent,
    NoTeamsMessage,
    CurrentTeams,
    
 } from "./Dashboard/";





export default function Dashboard(props) {

    const [teams, setTeams] = useState(null);

    const getTeams = async () => {
        if (props.user) {
            let response = await fetch(`teams/find/userid`);
            let {teams} = await response.json();
            setTeams(teams);
        } else return null;
    }

    useEffect(() => {
        getTeams();
    }, [])
    return (
        <div>
            {teams? <CurrentTeams teams={teams} /> : <NoTeamsMessage />}
            <NewTeamComponent getTeams={getTeams}></NewTeamComponent>

        </div>
    )
}