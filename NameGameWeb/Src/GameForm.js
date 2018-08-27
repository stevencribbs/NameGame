import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardText, Input, Button } from 'mdbreact';

class GameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gamemode: "standard" };
    }

    handleClick(mode, e) {
        e.preventDefault();
        $("#gameModeBtn").html(mode);
        this.setState({ gamemode: mode });
    }

    onStartGame(e) {
        this.props.handleNewGame(this.state.gamemode);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <Card border="dark" className="mb-3" style={{ width: '350px' }} >
                <CardHeader>Hello {this.props.userFN} </CardHeader>
                <CardBody>
                    <CardText>Select a game mode and click 'Start' to begin your game.</CardText>
                    <div className="btn-group btn-block">
                        <button type="button" id="gameModeBtn" className="btn btn-primary btn-block dropdown-toggle px-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Choose Game Mode
                        </button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("standard", e)} >Standard Game</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("standardhints", e)} >Standard with Hints</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("matmode", e)} >Mat(t) Mode</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("matmodehints", e)} >Mat(t) Mode with Hints</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("standardsmall", e)} >Standard Game (small)</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("standardlarge", e)} >Standard Game (large)</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("standardhintssmall", e)} >Standard with Hints (small)</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("standardhintslarge", e)} >Standard with Hints (large)</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("matmodesmall", e)} >Mat(t) Mode (small)</a>
                            <a className="dropdown-item" href="#" onClick={(e) => this.handleClick("matmodehintssmall", e)} >Mat(t) Mode with Hints (small)</a>
                        </div>
                    </div>
                    <Button className="btn btn-primary btn-block my-4 waves-effect" onClick={(e) => this.onStartGame(e)}>Start Game</Button>

                </CardBody>
            </Card>
        );
    }
}

export default GameForm;