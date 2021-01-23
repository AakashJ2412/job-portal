import React, { Component } from 'react';
import axios from 'axios';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            education: [],
            skills: [],
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEducation = this.onChangeEducation.bind(this);
        this.onChangeSkills = this.onChangeSkills.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ name: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ email: event.target.value });
    }

    onChangeEducation(event) {
        this.setState({ email: event.target.value });
    }

    onChangeSkills(event) {
        this.setState({ email: event.target.value });
    }
    onSubmit(e) {
        e.preventDefault();

        const newApp = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            education: this.state.education,
            skills: this.state.skills
        }
        axios.post('http://localhost:4000/user/registerapp', newApp)
            .then(res => { alert("Created\t" + res.data.name); console.log(res.data) })
            ;

        this.setState({
            name: '',
            email: '',
            password: '',
            education: '',
            skills: '',
        });
    }

    render() {
        return (
            <div class="container">
                <div class="d-flex justify-content-centre py-3">
                    <h1>Applicant Registration</h1>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Full Name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email"
                            className="form-control"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <label>Skills: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}