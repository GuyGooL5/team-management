import React from 'react';
import { Container, Typography, Button, ButtonGroup } from "@material-ui/core";

function Welcome (){
        return (
            <Container maxWidth="sm" >
                <Typography style={{ margin: "8px" }} variant="h6">Register or login and start creating teams today <span role="img" aria-label="smiling face with sunglasses">😎</span>.</Typography>
                <ButtonGroup  style={{ margin: "8px" }} variant="outlined" color="primary" >
                    <Button  href="/login">Login</Button>
                    <Button  href="/register">Register</Button>
                </ButtonGroup>
            </Container >
        )
}

export default Welcome;