import React, { Component } from 'react';
import axios from 'axios';
import { UserContext } from "../../UserContext";
import DateTimePicker from 'react-datetime-picker';

export default class createjob extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            rec_name: '',
            rec_email: '',
            app_no: '',
            pos_no: '',
            deadline: new Date(),
            skills: [{ title: "" }],
            type_job: "Full-time",
            duration: 0,
            salary: ''
        }
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeAppno = this.onChangeAppno.bind(this);
        this.onChangePosno = this.onChangePosno.bind(this);
        this.onChangeDeadline = this.onChangeDeadline.bind(this);
        this.onChangeTypejob = this.onChangeTypejob.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeSalary = this.onChangeSalary.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeTitle(event) {
        this.setState({ title: event.target.value });
    }

    onChangeAppno(event) {
        this.setState({ app_no: event.target.value });
    }
    onChangePosno(event) {
        this.setState({ pos_no: event.target.value });
    }
    onChangeDeadline(event) {
        this.setState({ deadline: event });
    }
    onChangeTypejob(event) {
        this.setState({ type_job: event.target.value });
    }
    onChangeDuration(event) {
        this.setState({ duration: event.target.value });
    }
    onChangeSalary(event) {
        this.setState({ salary: event.target.value });
    }


    onChangeSkill = idx => event => {
        const newSkill = this.state.skills.map((skill, sidx) => {
            if (idx !== sidx)
                return skill;
            return { ...skill, title: event.target.value };
        });
        this.setState({ skills: newSkill });
    };
    onAddSkill = () => {
        this.setState({
            skills: this.state.skills.concat([{ title: "" }])
        });
        //console.log(this.state.skills)
    };

    onRemoveSkill = idx => () => {
        this.setState({
            skills: this.state.skills.filter((s, sidx) => idx !== sidx)
        });
    };

    onSubmit(e) {
        e.preventDefault();
        const newJob = {
            title: this.state.title,
            rec_name: this.state.rec_name,
            rec_email: this.state.rec_email,
            app_no: this.state.app_no,
            pos_no: this.state.pos_no,
            deadline: this.state.deadline,
            skills: this.state.skills,
            type_job: this.state.type_job,
            duration: this.state.duration,
            salary: this.state.salary
        }
        console.log(newJob)
        axios.post('http://localhost:4000/job/registerjob', newJob)
            .then(res => {
                alert("Successfully Created Job");
                console.log(res.data);
                this.props.history.push('/dashboardrec')
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }

    getData = () => {
        axios.get('http://localhost:4000/job/getrec', { headers: { email: this.context.email } })
            .then(res => {
                console.log(res)
                this.setState({
                    rec_name: res.data.name,
                    rec_email: res.data.email
                })
            })
            .catch(error => {
                this.props.history.push('/dashboardrec')
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
                    <h1>Create New Job Listing</h1>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group pt-3">
                        <label>Job Title: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.title}
                            onChange={this.onChangeTitle} required
                        />
                    </div>
                    <div className="form-group">
                        <label>Recruiter Name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.rec_name}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Recruiter Email: </label>
                        <input type="email"
                            className="form-control"
                            value={this.state.rec_email}
                            readOnly
                        />
                    </div>
                    <div className="form-group pt-3">
                        <label>Total Applicant Slots: </label>
                        <input type="number"
                            className="form-control"
                            value={this.state.app_no}
                            onChange={this.onChangeAppno} required
                        />
                    </div>
                    <div className="form-group pt-3">
                        <label>Total Positions Open: </label>
                        <input type="number"
                            className="form-control"
                            value={this.state.pos_no}
                            onChange={this.onChangePosno} required
                        />
                    </div>
                    <div className="form-group pt-3">
                        <label>Type of Job: </label>
                        <div onChange={this.onChangeTypejob}>
                            <input type="radio" defaultChecked value="Full-time" name="gender" /> Full-time <br />
                            <input type="radio" value="Part-time" name="gender" /> Part-time <br />
                            <input type="radio" value="Work from home" name="gender" /> Work from home <br />
                        </div>
                    </div>
                    <div className="form-group pt-3">
                        <label>Deadline: </label><br />
                        <DateTimePicker onChange={this.onChangeDeadline} value={this.state.deadline} />
                    </div>
                    <div className="form-group pt-3">
                        <label>Recommended Skillset: </label>
                        {this.state.skills.map((skill, idx) => (
                            <div className="">
                                <input className="mr-5"
                                    type="text"
                                    placeholder={`Skill #${idx + 1} name`}
                                    value={skill.title}
                                    onChange={this.onChangeSkill(idx)}
                                />
                                <button
                                    type="button md-6"
                                    onClick={this.onRemoveSkill(idx)}
                                    className="btn btn-primary">
                                    Delete
                                    </button>
                            </div>))}
                        <button
                            type="button"
                            onClick={this.onAddSkill}
                            className="btn btn-primary mb-2">
                            Add Skill</button>
                    </div>
                    <div className="form-group pt-3">
                        <label>Salary: </label>
                        <input type="number"
                            className="form-control"
                            value={this.state.salary}
                            onChange={this.onChangeSalary} required
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration of Job: </label>
                        <select value={this.state.duration} onChange={this.onChangeDuration} className="form-control" required>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create job" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}