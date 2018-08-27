import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardText, CardFooter, Input, Button } from 'mdbreact';

class GameComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
        
    }

    render() {
        return (
            <Card border="dark" className="mb-3 text-center" style={{ width: '450px' }} >
                <CardHeader>Well Done {this.props.userFN} </CardHeader>
                <CardBody>
                    <CardText>You just completed a "{this.props.gameMode}" game.</CardText>
                    <CardText>You had a total of "{this.props.gameQCount}" questions.</CardText>
                    <CardText>You finished with "{this.props.gameQAttempts}" attempts.</CardText>
                </CardBody>
                <CardFooter className="text-center">
                    <Button color="blue-grey" onClick={this.props.handleEndGame}>Start New Game</Button>
                    <Button color="blue-grey" onClick={this.props.handleLogout}>Logout</Button>
                </CardFooter>
            </Card>
        );
    }
}

export default GameComplete;