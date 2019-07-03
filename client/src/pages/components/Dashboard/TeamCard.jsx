import React from 'react';
import {
    Card,
    Typography,
    CardActionArea,
    CardContent,
} from "@material-ui/core";
import {OpenInNew} from "@material-ui/icons";

export default function TeamCard(props) {

    function openFull() {
        props.expand(props._id);
    }
    return (
        <Card>

            <CardActionArea onMouseUp={openFull}>
                <CardContent>
                    <Typography variant="h5">{props.team.name}</Typography>
                    <Typography variant="body1">{props.team.description || 'No description'}</Typography>
                    <Typography variant="body2">{`${props.team.members.length} member${props.team.members.length > 1 ? 's' : ''} here.`}</Typography>
                </CardContent>
                <OpenInNew style={{ position: 'absolute', right: '8px', bottom: '8px' }} />
            </CardActionArea>
        </Card>
    )
}
