import React, { Component } from 'react';
import axios from 'axios';
import { UserContext } from "../../UserContext";
import { useContext } from 'react';
import Resizer from 'react-image-file-resizer';

export default class Register extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            formtype: 'app',
            name: '',
            email: '',
            password: '',
            education: [{ inst_name: "", start_year: "", end_year: "" }],
            skills: [{ title: "" }],
            ph_no: '',
            bio: '',
            picture: "",
            picname: ""
        }
        this.onChangetype = this.onChangetype.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangetype(event) {
        this.setState({ formtype: event.target.value });
    }

    onChangeUsername(event) {
        this.setState({ name: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeEducation(event) {
        this.setState({ education: event.target.value });
    }
    onChangeNumber(event) {
        this.setState({ ph_no: event.target.value });
    }
    onChangeBio(event) {
        this.setState({ bio: event.target.value });
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
        if (this.state.formtype === 'app') {
            const newApp = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                education: this.state.education,
                skills: this.state.skills,
                picture: this.state.picture
            }
            axios.post('http://localhost:4000/job/registerapp', newApp)
                .then(res => {
                    alert("Created New Applicant " + res.data.name);
                    console.log(res.data)
                    const newUser = {
                        email: newApp.email,
                        password: newApp.password
                    }
                    axios.post('http://localhost:4000/job/login', newUser)
                        .then((resl) => {
                            this.context.setUser(resl.data.token, true, newUser.email, resl.data.type);
                            localStorage.setItem('payload', resl.data.token);
                            this.props.history.push('/dashboardapp')
                            console.log(this.context.type)
                        })
                        .catch((error) => {
                            alert(error.response.data.error);
                        });
                })
                .catch((error) => {
                    alert(error.response.data.error);
                });
        }
        else if (this.state.formtype === 'rec') {
            const newRec = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                ph_no: this.state.ph_no,
                bio: this.state.bio,
            }
            console.log(newRec)
            axios.post('http://localhost:4000/job/registerrec', newRec)
                .then(res => {
                    alert("Created New Recruiter " + res.data.name);
                    console.log(res.data)
                    const newUser = {
                        email: newRec.email,
                        password: newRec.password
                    }
                    console.log(newUser)
                    axios.post('http://localhost:4000/job/login', newUser)
                        .then(resl => {
                            console.log('this is resl');
                            console.log(resl);
                            this.context.setUser(resl.data.token, true, newUser.email, resl.data.type);
                            localStorage.setItem('payload', resl.data.token);
                            console.log(this.context.type);
                            this.props.history.push('/dashboardrec');
                        })
                        .catch((error) => {
                            alert(error.response.data.error);
                        });
                })
                .catch((error) => {
                    alert(error.response.data.error);
                });
        };
    }


    render() {
        if (this.state.formtype === 'app') {
            return (
                <div className="container">
                    <div className="d-flex justify-content-centre py-3">
                        <h1>Registration Form</h1>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Select Category: </label>
                            <select value={this.state.formtype} onChange={this.onChangetype} className="form-control">
                                <option value="app" default>Applicant</option>
                                <option value="rec">Recruiter</option>
                            </select>
                        </div>
                        <div className="form-group">
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
                                value={this.state.email}
                                onChange={this.onChangeEmail} required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input type="password"
                                className="form-control"
                                value={this.state.password}
                                onChange={this.onChangePassword} required
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
                            <label>Upload Profile Picture: </label>
                            <input type="file" accept=".png"
                                className="form-control"
                                onChange={this.onChangePicture}
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Register" className="btn btn-primary" />
                        </div>
                    </form>
                </div>
            )
        }
        else if (this.state.formtype === 'rec') {
            return (
                <div className="container">
                    <div className="d-flex justify-content-centre py-3">
                        <h1>Registration Form</h1>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Select Category: </label>
                            <select value={this.state.formtype} onChange={this.onChangetype} className="form-control">
                                <option value="app">Applicant</option>
                                <option value="rec">Recruiter</option>
                            </select>
                        </div>
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
                                value={this.state.email}
                                onChange={this.onChangeEmail} required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input type="password"
                                className="form-control"
                                value={this.state.password}
                                onChange={this.onChangePassword} required
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
                            <input type="submit" value="Register" className="btn btn-primary" />
                        </div>
                    </form>
                </div>
            )
        }
        else {
            return (
                <div>Error</div>
            )
        }
    }
}