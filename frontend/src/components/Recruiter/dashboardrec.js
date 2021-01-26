import React, { Component } from 'react';
import axios from 'axios';
import { UserContext } from "../../UserContext";

export default class dashboardrec extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            ph_no: '',
            bio: ''
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.onSubmitR = this.onSubmitR.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ name: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangeNumber(event) {
        this.setState({ ph_no: event.target.value });
    }

    onChangeBio(event) {
        this.setState({ bio: event.target.value });
    }

    onSubmitR(e) {
        e.preventDefault();
        const newRec = {
            name: this.state.name,
            email: this.context.email,
            ph_no: this.state.ph_no,
            bio: this.state.bio,
        }
        //console.log(this.context);
        axios.put('http://localhost:4000/job/editrec', newRec)
            .then(res => {
                alert("Successfully Updated Details");
                //console.log('Recruiter updated')
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }

    getRec = () => {
        axios.get('http://localhost:4000/job/getrec', { headers: { email: this.context.email } })
            .then(res => {
                this.setState({
                    name: res.data.name,
                    email: res.data.email,
                    ph_no: res.data.ph_no,
                    bio: res.data.bio
                })
            })
            .catch(error => {
                this.context.logout();
                this.props.history.push('/')
                alert(error.response.data.error);
            });
    }

    componentDidMount() {
        this.getRec();
    }

    render() {
        return (
            <div className="container">
                <div className="d-flex justify-content-centre py-3">
                    <h1>Recruiter Dashboard</h1>
                </div>
                <form onSubmit={this.onSubmitR}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeUsername} required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email"
                            className="form-control"
                            value={this.context.email}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Number: </label>
                        <input type="number"
                            className="form-control"
                            value={this.state.ph_no}
                            onChange={this.onChangeNumber} required
                        />
                    </div>
                    <div className="form-group">
                        <label>Bio: </label>
                        <textarea type="text"
                            className="form-control"
                            value={this.state.bio}
                            onChange={this.onChangeBio} required
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update Details" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}