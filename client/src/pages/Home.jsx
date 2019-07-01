/* eslint-disable no-useless-constructor */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }
    componentWillMount() {
        if (this.props.user) {
            this.setState({ name: this.props.user.firstname ? this.props.user.firstname : this.props.user.username });
        }
    }
    render() {
        const notAuthedButtons = 
        <div>
            <Button color="inherit" href="/login">Login</Button>
            <Button color="inherit" href="/register">Register</Button>
        </div>
        const authedButtons = 
        <div>
            <Button color="inherit" href="/dashboard">Dashboard</Button>
            <Button color="inherit" href="/logout">Logout</Button>
        </div>
        return (
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6">{`Welcome ${this.state.name}`}</Typography>
                    {this.props.isAuthed?authedButtons:notAuthedButtons}
                </Toolbar>

            </AppBar>


        )
    }
}

export default HomePage;