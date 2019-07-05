import React from 'react';
import { Typography } from "@material-ui/core";

import { Create } from "@material-ui/icons";
export default function NoTeamsMessage() {
    return (
        <div>
            <Typography style={{ margin: '8px' }} variant="h6">You currently have no teams.</Typography>
            <Typography style={{ margin: '8px' }} variant="body1">Press the <Create fontSize="small" /> down right to create one.</Typography>
        </div>
    )
}
