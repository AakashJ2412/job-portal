import React, { Component } from 'react';
import axios from 'axios';
import { UserContext } from "../../UserContext";
import Resizer from 'react-image-file-resizer';

export default class dashboardapp extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            education: [{ inst_name: "", start_year: "", end_year: "" }],
            skills: [{ title: "" }],
            picture: '',
            picname: ''
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePicture = this.onChangePicture.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ name: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    resize = (img) => {
        return new Promise(resolve => {
            Resizer.imageFileResizer(img, 200, 200, 'PNG', 100, 0,
                uri => resolve(uri),
                'base64');
        });
    }

    onChangePicture = async (event) => {
        this.setState({ fileName: event.target.files[0].name });
        const temp = await this.resize(event.target.files[0]);
        this.setState({ picture: temp });
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

    onChangeEduInst = idx => event => {
        const newEdu = this.state.education.map((education, sidx) => {
            if (idx !== sidx)
                return education;
            return { ...education, inst_name: event.target.value };
        });
        this.setState({ education: newEdu });
    };

    onChangeEduStart = idx => event => {
        const newEdu = this.state.education.map((education, sidx) => {
            if (idx !== sidx)
                return education;
            return { ...education, start_year: event.target.value };
        });
        this.setState({ education: newEdu });
    };

    onChangeEduEnd = idx => event => {
        const newEdu = this.state.education.map((education, sidx) => {
            if (idx !== sidx)
                return education;
            return { ...education, end_year: event.target.value };
        });
        this.setState({ education: newEdu });
    };

    onAddEdu = () => {
        this.setState({
            education: this.state.education.concat([{ inst_name: "", start_year: "", end_year: "" }])
        });
        //console.log(this.state.skills)
    };

    onRemoveEdu = idx => () => {
        this.setState({
            education: this.state.education.filter((s, sidx) => idx !== sidx)
        });
    };

    onSubmit(e) {
        e.preventDefault();
        const newApp = {
            name: this.state.name,
            email: this.context.email,
            education: this.state.education,
            skills: this.state.skills,
            picture: this.state.picture
        }
        console.log(newApp)
        axios.put('http://localhost:4000/job/editapp', newApp)
            .then(res => {
                alert("Successfully Updated Details");
                console.log(res.data)
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }

    getData = () => {
        console.log('start dash')
        console.log(this.context.email);
        axios.get('http://localhost:4000/job/getapp', { headers: { email: this.context.email } })
            .then(res => {
                console.log(res)
                this.setState({
                    name: res.data.name,
                    education: res.data.education,
                    skills: res.data.skills,
                    picture: res.data.picture
                })
            })
            .catch(error => {
                this.context.logout();
                this.props.history.push('/')
                //alert(error.response.data.error);
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
                    <h1>Applicant Dashboard</h1>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <img src={this.state.picture} alt="Profile Picture" />
                    </div>
                    <label>Update Profile Picture: </label>
                    <input type="file" accept=".png"
                        className="form-control"
                        onChange={this.onChangePicture}
                    />
                    <div className="form-group pt-3">
                        <label>Full Name: </label>
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
                        <label>Skills: </label>
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
                            className="btn btn-primary mb-5">
                            Add Skill</button>
                    </div>
                    <div className="form-group">
                        <label>Education: </label>
                        {this.state.education.map((education, idx) => (
                            <div className="">
                                <input className="mr-5"
                                    type="text"
                                    placeholder={`Education #${idx + 1} institute name`}
                                    value={education.inst_name}
                                    onChange={this.onChangeEduInst(idx)}
                                />
                                <input className="mr-5"
                                    type="number"
                                    placeholder={`Education #${idx + 1} Start Year`}
                                    value={education.start_year}
                                    onChange={this.onChangeEduStart(idx)}
                                />
                                <input className="mr-5"
                                    type="number"
                                    placeholder={`Education #${idx + 1} End Year`}
                                    value={education.end_year}
                                    onChange={this.onChangeEduEnd(idx)}
                                />
                                <button
                                    type="button md-6"
                                    onClick={this.onRemoveEdu(idx)}
                                    className="btn btn-primary">
                                    Delete
                                    </button>
                            </div>))}
                        <button
                            type="button"
                            onClick={this.onAddEdu}
                            className="btn btn-primary mb-5">
                            Add Education</button>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Update Details" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}