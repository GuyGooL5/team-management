import React from 'react';
import {Link} from 'react-router-dom'
import { Container, Typography, Button, ButtonGroup } from "@material-ui/core";

function Welcome (){
        return (
            <Container maxWidth="sm" >
                <Typography style={{ margin: "8px" }} variant="h6">Register or login and start creating teams today <span role="img" aria-label="smiling face with sunglasses">😎</span>.</Typography>
                <ButtonGroup  style={{ margin: "8px" }} variant="outlined" color="primary" >
                    <Button component={Link} to="/login">Login</Button>
                    <Button component={Link} to="/register">Register</Button>
                </ButtonGroup>
            </Container >
        )
}

export default Welcome;