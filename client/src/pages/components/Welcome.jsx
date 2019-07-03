import React from 'react';
import { Container, Typography, Button, ButtonGroup } from "@material-ui/core";

class Welcome extends React.Component {

    render() {
        return (
            <Container maxWidth="sm" style={{ margin: "8px" }}>
                <Typography variant="h5">Register or login and start creating teams today <span role="img" aria-label="smiling face with sunglasses">😎</span>.</Typography>
                <ButtonGroup variant="outlined" color="primary" >
                    <Button  href="/login">Login</Button>
                    <Button  href="/register">Register</Button>
                </ButtonGroup>
            </Container >
        )
    }
}

export default Welcome;