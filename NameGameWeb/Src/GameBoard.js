import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardText, CardFooter, Input, Button, View, Mask } from 'mdbreact';
import API from "./Api";

class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qNumber: 0,
            qAttempts: 0,
            qData: [],
            qClue: ""
        }
        this.getQuestionData = this.getQuestionData.bind(this);
        this.getNextQuestion = this.getNextQuestion.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.endGame = this.endGame.bind(this);
    }

    getQuestionData(qNum) {
        API.get('game/gameQuestion/' + this.props.gameId + '/' + qNum).then((response) => {
            //console.log(response);
            if (response.data.question == "done") {
                alert("game complete");
            }
            else {
                var temp = JSON.parse(response.data.question);
                this.setState({
                    qNumber: qNum,
                    qData: temp,
                    qClue: response.data.clue
                });
            }
            $("body").css("cursor", "default");
        })
            .catch(function (error) {
                console.log(error);
                alert("Failed to get question");
                $("body").css("cursor", "default");
            });
    }

    getNextQuestion() {
        if (this.state.qNumber == this.props.gameQCount) {
            //no more questions
            alert("no more questions");
            this.endGame();
            return;
        }
        var qNum = this.state.qNumber;
        qNum++;
        this.getQuestionData(qNum);
    }

    checkAnswer(index) {
        //index is from 0-based array; add 1 to get the actual guess
        var i = index + 1;
        API.get('game/checkAnswer/' + this.props.gameId + '/' + this.state.qNumber + "/" + i).then((response) => {
            //console.log(response);
            if (response.data == "correct") {
                alert("Great Job! Correct Answer!");
                this.getNextQuestion();
            }
            else {
                alert("Incorrect Answer...Try Again")
            }
            var attempts = this.state.qAttempts + 1;
            this.setState((prevState, props) => ({
                qAttempts: prevState.qAttempts + 1
            }));
            $("#divAttempts").html("Attempts: " + attempts);
            $("body").css("cursor", "default");
        })
            .catch(function (error) {
                console.log(error);
                alert("Failed to get question");
                $("body").css("cursor", "default");
            });
    }

    endGame() {
        this.props.handleEndGame(this.state.qAttempts);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.qNumber == this.state.qNumber) {
            return false;
        }
        return true;
    }

    componentDidMount() {
        this.getQuestionData(1);
    }

    render() {
        //const items = this.props.gameData.map((t) => {
        //    itemStyle = itemStyle == 0 ? 1 : 0;
        //    return (
        //        <li key={t.ID}><Task task={t} taskStyle={itemStyle} toggleComplete={this.props.toggleComplete} deleteTask={this.props.deleteTask} /></li>

        //    );
        //});
        var useHints = this.props.gameMode.toLowerCase().includes("hint");
        const items = this.state.qData.map((d, index) => {
            if (useHints) {
                return (
                    <div key={index} className="float-left game-tile" onClick={(e) => this.checkAnswer(index, e)} title={d.jobTitle} ><img src={d.headshotUrl} className="img-thumbnail" style={{ width: "150px" }} /></div>
                );
            }
            else {
                return (
                    <div key={index} className="float-left game-tile" onClick={(e) => this.checkAnswer(index, e)} ><img src={d.headshotUrl} className="img-thumbnail img-fluid hoverable" style={{ width: "150px" }} /></div>
                );
            }
        });

        return (
            <Card border="dark" className="mb-3">
                <CardHeader>
                    <div className="float-left">Question: {this.state.qNumber} of {this.props.gameQCount}</div>
                    <div className="float-right" id="divAttempts">Attempts: {this.state.qAttempts}</div>
                </CardHeader>
                <CardBody>
                    <div className="m-2">{items}</div>
                </CardBody>
                <CardFooter transparent>
                    <CardTitle>Who is {this.state.qClue}? Click the right picture.</CardTitle>
                </CardFooter>
                <CardFooter>
                    <Button color="blue-grey" onClick={this.getNextQuestion}>Skip Question</Button>
                    <Button color="blue-grey" onClick={this.endGame}>End Game</Button>
                </CardFooter>
            </Card>
        );
    }
}

export default GameBoard;