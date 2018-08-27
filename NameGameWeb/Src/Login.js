import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Input, Button } from 'mdbreact';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        //this.onLogin = this.onLogin.bind(this);
    }

    onLogin(e) {
        e.preventDefault();
        $("body").css("cursor", "progress");
        this.props.handleLogin($("#loginUsername").val(), $("#loginPassword").val());
        
    }

    render() {
        return (
            <Card style={{ width: '400px' }} >
                <CardHeader tag="h5" className="primary-color white-text text-center py-4">
                    <strong>Login</strong>
                </CardHeader>
                <CardBody className="px-lg-5 pt-0">    
                    <form>    
                        <div className="grey-text">
                            <Input label="username" type="text" id="loginUsername" icon="user" group />
                            <Input label="password" type="password" id="loginPassword" icon="lock" group />
                        </div>
                        <Button className="btn btn-block my-4 waves-effect" type="submit" onClick={(e)=>this.onLogin(e)}>Login</Button>
                        <div className="text-center">
                            <p className="mb-0">Not a member?</p>
                            <Button size="sm" className="btn btn-blue-grey waves-effect" onClick={ (e) => this.props.changeForm("register", e) } >Register</Button>
                        </div>
                    </form>                            
                </CardBody>
            </Card>
        );
    }
}
                        
export default LoginForm;