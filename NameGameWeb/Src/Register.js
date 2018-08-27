import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Input, Button } from 'mdbreact';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
    }

    onRegister(e) {
        e.preventDefault();
        $("body").css("cursor", "progress");
        if ($("#registerPassword").val() != $("#registerConfirmPassword").val()) {
            alert("Passwords do not match. Please try again.");
            return;
        }
        var user = {};
        user.FirstName = $("#registerFirstName").val();
        user.LastName = $("#registerLastName").val();
        user.UserName = $("#registerUsername").val();
        user.Password = $("#registerPassword").val();
        this.props.handleRegister(user);
    }

    render() {
        return (
            <Card style={{ width: '400px' }} >
                <CardHeader tag="h5" className="default-color white-text text-center py-4">
                    <strong>Sign Up</strong>
                </CardHeader>
                <CardBody className="px-lg-5 pt-0">
                    <form>
                        <div className="grey-text">
                            <div className="form-row">
                                <div className="col">
                                    <Input label="First name" id="registerFirstName" type="text" />
                                </div>
                                <div className="col">
                                    <Input label="Last name" id="registerLastName" type="text" />
                                </div>
                            </div>
                            <Input label="Username" id="registerUsername" icon="user" group type="text" />
                            <Input label="Password" id="registerPassword" icon="lock" group type="password" />
                            <Input label="Confirm password" id="registerConfirmPassword" icon="exclamation-triangle" group type="password" />
                        </div>
                        <Button color="primary" className="btn btn-block my-4 waves-effect" type="submit" onClick={(e) => this.onRegister(e)}>Register</Button>
                        <div className="text-center">
                            <p className="mb-0">Already a member?</p>
                            <Button size="sm" className="btn btn-blue-grey waves-effect" onClick={(e) => this.props.changeForm("login", e)} >Login</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        );
    }
}

export default RegisterForm;