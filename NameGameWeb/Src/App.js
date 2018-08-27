import React, { Component } from 'react';
import API from './Api';
import LoginForm from './Login';
import RegisterForm from "./Register";
import GameForm from "./GameForm";
import GameBoard from "./GameBoard";
import GameComplete from "./GameComplete";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: "login",
            userId: 0,
            userFirstName: "",
            userLastName: "",
            username: "",
            gameId: 0,
            gameMode: "",
            gameData: "",
            gameQCount: 0,
            gameQAttempts: 0
        }
        this.changeForm = this.changeForm.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
        this.handleEndGame = this.handleEndGame.bind(this);
        this.handleGameCleanup = this.handleGameCleanup.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    changeForm(newForm) {
        this.setState({ form: newForm });
    }

    handleLogin(username, password, e) {
        //alert(username + ":" + password);
        const self = this;
        var pkg = { "UserName": username, "Password": password };
        API.post('game/login/', pkg).then((response) => {
            console.log(response);
            this.setState({
                form: "gameform",
                userId: response.data.UserId,
                userFirstName: response.data.FirstName,
                userLastName: response.data.LastName,
                username: response.data.UserName
            });
            $("body").css("cursor", "default");
        })
        .catch(function (error) {
            console.log(error);
            alert("Login failed");
            $("body").css("cursor", "default");
        });
    }

    handleRegister(user, e) {
        //alert(username + ":" + password);
        const self = this;
        API.post('game/newUser/', user).then((response) => {
            //console.log(response);
            this.setState({
                form: "gameform",
                userId: response.data.UserId,
                userFirstName: response.data.FirstName,
                userLastName: response.data.LastName,
                username: response.data.UserName
            });
            $("body").css("cursor", "default");
        })
        .catch(function (error) {
            console.log(error);
            alert("Registration failed");
            $("body").css("cursor", "default");
        });
    }

    handleNewGame(gamemode, e) {
        const self = this;
        API.get('game/newGame/'+ this.state.userId + '/' + gamemode ).then((response) => {
            //console.log(response);
            this.setState({
                form: "gameboard",
                gameId: response.data.GameId,
                gameMode: response.data.GameMode,
                gameData: response.data.GameData,
                gameQCount: response.data.QCount
            });
            $("body").css("cursor", "default");
        })
        .catch(function (error) {
            console.log(error);
            alert("Failed to create new game");
            $("body").css("cursor", "default");
        });
    }

    handleEndGame(attempts) {
        this.setState({
            form: "gamecomplete",
            gameQAttempts: attempts
        });
    }

    handleGameCleanup() {
        this.setState({
            form: "gameform",
            gameId: 0,
            gameMode: "",
            gameData: "",
            gameQCount: 0
        });
    }

    handleLogout() {
        this.setState({
            form: "login",
            userId: 0,
            userFirstName: "",
            userLastName: "",
            username: "",
            gameId: 0,
            gameMode: "",
            gameData: "",
            gameQCount: 0,
            gameQAttempts: 0
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.form == this.state.form) {
            return false;
        }
        return true;
    }

    getComponent() {
        const formToLoad = this.state.form;
        let formComponent;
        
        switch (formToLoad) {
            case "register":
                formComponent = <RegisterForm handleRegister={this.handleRegister} changeForm={this.changeForm} />;
                break;
            case "gameform":
                formComponent = <GameForm handleNewGame={this.handleNewGame} userFN={this.state.userFirstName} />;
                break;
            case "gameboard":
                formComponent = <GameBoard userId={this.state.userId} gameId={this.state.gameId} gameMode={this.state.gameMode} gameQCount={this.state.gameQCount} handleEndGame={this.handleEndGame} />;
                break;
            case "gamecomplete":
                formComponent = <GameComplete userId={this.state.userId} userFN={this.state.userFirstName} gameMode={this.state.gameMode} gameQAttempts={this.state.gameQAttempts} gameQCount={this.state.gameQCount} handleEndGame={this.handleGameCleanup} handleLogout={this.handleLogout} />;
                break;
            default:  //login
                formComponent = <LoginForm handleLogin={this.handleLogin} changeForm={(e)=>this.changeForm(e)} />;
                break;
        }
        return formComponent;
    }

    render() {
        
        return (
            <div className="app">
                <header className="app-header bg-primary">
                    <label className="app-title font-weight-normal">The "Do You Know My Name" Game</label>
                </header>
                <div className="d-flex justify-content-center mt-5">
                    { this.getComponent() }
                </div>
            </div>
        );
    }
}


export default App;