import React from 'react';
import { Link } from "react-router-dom";

import {
    Card,
    Typography,
    CardActionArea,
    CardContent,
} from "@material-ui/core";
import {OpenInNew} from "@material-ui/icons";

export default function TeamCard({team,setTeamId}) {

    return (
        <Card>

            <CardActionArea onClick={()=>setTeamId(team._id)}>
                <CardContent>
                    <Typography variant="h5">{team.name}</Typography>
                    <Typography variant="body1">{team.description || 'No description'}</Typography>
                    <Typography variant="body2">{`${team.members.length} member${team.members.length > 1 ? 's' : ''} here.`}</Typography>
                </CardContent>
                <OpenInNew style={{ position: 'absolute', right: '8px', bottom: '8px' }} />
            </CardActionArea>
        </Card>
    )
}
