import React from 'react';
import { Typography } from "@material-ui/core";

export default function NoTeamsMessage() {
    return (
        <div>
            <Typography style={{ margin: '8px' }} variant="h6">You currently have no teams.</Typography>
            <Typography style={{ margin: '8px' }} variant="caption">Press the + button to create one.</Typography>
        </div>
    )
}
