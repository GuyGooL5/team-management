import React, { useState, useEffect } from 'react';
import {
    IconButton,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Divider
} from "@material-ui/core";
import { Person, MoreVert } from "@material-ui/icons";
import { MemberMenuComponent } from './';

export default function MemberItem({user, member, isLast,team_id, refreshMembers }) {

    const [anchorEl, setAnchorEl] = useState(null)

    const handlers = {
        openMenu: (e) => {
            setAnchorEl(e.currentTarget);
        },
        closeMenu:()=>{
            setAnchorEl(null);
        }
    }

    
    return (
                <React.Fragment>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar><Person /></ListItemAvatar>
                        <ListItemText
                            primary={`${member.user.username}, ${member.permission}`}
                            secondary= {`${member.user.firstname ? member.user.firstname : ''} ${member.user.lastname ? member.user.lastname : ''}`}
                            />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="MoreVert" onClick={handlers.openMenu}>
                                <MoreVert />
                            </IconButton>
                        </ListItemSecondaryAction>

                    </ListItem>
                    {isLast ? null : <Divider variant="inset" />}
                    <MemberMenuComponent refreshMembers={refreshMembers} anchor={anchorEl} user={user} member={member.user} team_id={team_id} permission={member.permission} close={handlers.closeMenu}/>
                </React.Fragment>    )
}
