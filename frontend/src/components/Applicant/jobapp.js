import React, { Component } from 'react';
import axios from 'axios';
import { UserContext } from "../../UserContext";
import Resizer from 'react-image-file-resizer';

export default class jobapp extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            email: '',
            SOP: '',
            rec_name: '',
            salary: ''
        }

        this.onChangeSOP = this.onChangeSOP.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeSOP(event) {
        this.setState({ SOP: event.target.value });
    }


    onSubmit(e) {
        e.preventDefault();
        console.log(this.state)
        const newApp = {
            title: this.state.title,
            email: this.context.email,
            SOP: this.state.SOP,
            rec_name: this.state.rec_name,
            salary: this.state.salary,
            joindate: new Date()
        }
        console.log('this is newapp')
        console.log(newApp)
        axios.post('http://localhost:4000/job/apply', newApp)
            .then(res => {
                alert("Successfully Applied for Job");
                this.props.history.push('/dashboardapp')
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }

    getData = () => {
        let temp = window.location.href.split('/');
        let temp2 = temp.pop()
        let job_title = temp2.replace(/%20/g, " ");
        axios.get('http://localhost:4000/job/getjob', { headers: { title: job_title } })
            .then(res => {
                console.log(res)
                this.setState({
                    title: job_title,
                    rec_name: res.data.rec_name,
                    salary: res.data.salary
                })
            })
            .catch(error => {
                this.props.history.push('/dashboardapp')
                alert(error.response.data.error);
            });
        console.log('end dash')
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div className="container">
                <div className="d-flex justify-content-centre py-3">
                    <h1>Apply for Job</h1>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group pt-3">
                        <label>Job Title: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.title}
                            readOnly
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
                        <label>Statement of Purpose: </label>
                        <textarea type="text"
                            className="form-control"
                            value={this.state.SOP}
                            onChange={this.onChangeSOP} required
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit Application" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}