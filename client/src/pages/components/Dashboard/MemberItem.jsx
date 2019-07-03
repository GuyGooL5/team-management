import React, { useState, useEffect } from 'react';
import {Card} from "@material-ui/core";
import {} from "@material-ui/icons";


export default function MemberItem(props) {


    return (
        <Card>{props.firstname}</Card>
    )
}
