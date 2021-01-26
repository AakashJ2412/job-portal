import React, { Component } from 'react';
import axios from 'axios';
import { UserContext } from "../../UserContext";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default class currentapp extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            appl: [],
            namesortvar: 0,
            datesortvar: 0,
            jtitle: '',
            pos_no: '',
            cur_pos: ''
        }
        this.shortlist = this.shortlist.bind(this);
        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);
    }

    getData = async () => {
        try {
            let temp = window.location.href.split('/');
            let temp2 = temp.pop()
            let job_title = temp2.replace(/%20/g, " ");
            const job_details = await axios.get('http://localhost:4000/job/getjob', { headers: { title: job_title } });
            this.setState({
                jtitle: job_title,
                pos_no: job_details.data.pos_no,
                cur_pos: job_details.data.cur_pos
            })
            const appjob = await axios.get('http://localhost:4000/job/titlejob', { headers: { title: job_title } });
            const appl = await axios.get('http://localhost:4000/job/app');
            const allapp = await axios.get('http://localhost:4000/job/appl');
            let applications = appjob.data
            let applicants = appl.data
            let data = []
            applications.forEach(((application) => {
                if (application.status != "Rejected" && application.status != "Deleted") {
                    let appl_data = applicants.find((applt) => applt.email === application.applicant);
                    console.log(appl_data);
                    if (this.state.cur_pos >= this.state.pos_no && application.status != "Accepted") {
                        const updData = {
                            email: appl_data.email,
                            title: this.state.jtitle,
                            status: "Rejected"
                        }
                        axios.put('http://localhost:4000/job/updstat', updData)
                    }
                    data.push({
                        name: appl_data.name,
                        email: appl_data.email,
                        skills: appl_data.skills,
                        appdate: application.appdate,
                        education: appl_data.education,
                        SOP: application.SOP,
                        status: application.status
                    })
                }
            }));
            applications.map(((application) => {
                if (application.status === "Accepted") {
                    let temp_email = application.applicant;
                    allapp.data.map((nest_app) => {
                        if (nest_app.applicant === temp_email && nest_app.status != "Accepted" && nest_app.status != "Deleted") {
                            const updData = {
                                email: temp_email,
                                title: nest_app.job,
                                status: "Rejected"
                            }
                            console.log(updData);
                            axios.put('http://localhost:4000/job/updstat', updData)
                        }
                    })
                }
            }));
            this.setState({
                appl: data
            });
            console.log(this.state.appl)
        }
        catch {
            alert('Error loading data');
            this.props.history.push('/dashboardrec');
        }
    }

    componentDidMount() {
        this.getData();
    }

    sortName = () => {
        const array = this.state.appl;
        if (this.state.namesortvar === 0) {
            array.sort(function (a, b) {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });
            this.setState({
                appl: array,
                namesortvar: 1
            });
        } else {
            array.sort(function (a, b) {
                if (a.name < b.name) { return 1; }
                if (a.name > b.name) { return -1; }
                return 0;
            });
            this.setState({
                appl: array,
                namesortvar: 0
            });
        }
    }
    sortDate = () => {
        const array = this.state.appl;
        if (this.state.datesortvar === 0) {
            array.sort((a, b) => new Date(a.appdate) - new Date(b.appdate));
            this.setState({
                appl: array,
                datesortvar: 1
            });
        } else {
            array.sort((a, b) => new Date(b.appdate) - new Date(a.appdate));
            this.setState({
                appl: array,
                datesortvar: 0
            });
        }
    }
    renderIconName() {
        if (this.state.namesortvar === 0) {
            return (
                <ArrowDownwardIcon />
            )
        }
        else {
            return (
                <ArrowUpwardIcon />
            )
        }
    }
    renderIconDate() {
        if (this.state.datesortvar === 0) {
            return (
                <ArrowDownwardIcon />
            )
        }
        else {
            return (
                <ArrowUpwardIcon />
            )
        }
    }

    shortlist(app_email) {
        const updData = {
            email: app_email,
            title: this.state.jtitle,
            status: "Shortlisted"
        }
        axios.put('http://localhost:4000/job/updstat', updData)
            .then(res => {
                alert("Successfully Shortlisted Candidate");
                console.log(res.data);
                window.location.reload();
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }
    accept(app_email) {
        const updData = {
            email: app_email,
            title: this.state.jtitle,
            status: "Accepted"
        }
        axios.put('http://localhost:4000/job/updstat', updData)
            .then(res => {
                alert("Successfully Accepted Candidate");
                console.log(res.data);
                this.getData()
                window.location.reload();
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }

    reject(app_email) {
        const updData = {
            email: app_email,
            title: this.state.jtitle,
            status: "Rejected"
        }
        axios.put('http://localhost:4000/job/updstat', updData)
            .then(res => {
                alert("Successfully Rejected Candidate");
                console.log(res.data);
                window.location.reload();
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }
    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {/*<TableCell> <Button onClick={this.sortChange}>{this.renderIcon()}</Button>Date</TableCell>*/}
                                        <TableCell><Button onClick={this.sortName}>{this.renderIconName()}</Button><br />Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Skills</TableCell>
                                        <TableCell><Button onClick={this.sortDate}>{this.renderIconDate()}</Button><br />Date of Application</TableCell>
                                        <TableCell>Education</TableCell>
                                        <TableCell>Statement of Purpose</TableCell>
                                        <TableCell>Application Status</TableCell>
                                        <TableCell></TableCell>
                                        {/*<TableCell>Confidence</TableCell>*/}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.appl.map((job, ind) => (
                                            <TableRow key={ind}>
                                                <TableCell>{job.name}</TableCell>
                                                <TableCell>{job.email}</TableCell>
                                                <TableCell>{
                                                    job.skills.map((skill, sind) => (
                                                        <TableRow key={sind}>
                                                            <TableCell>{skill.title}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }</TableCell>
                                                <TableCell>{new Intl.DateTimeFormat("en-GB", { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(job.appdate))}</TableCell>
                                                <TableCell>{
                                                    job.education.map((edu, eind) => (
                                                        <TableRow key={eind}>
                                                            <TableCell>{edu.inst_name}</TableCell>
                                                            <TableCell>{edu.start_year}</TableCell>
                                                            <TableCell>{edu.end_year}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }</TableCell>
                                                <TableCell>{job.SOP}</TableCell>
                                                <TableCell>{job.status}</TableCell>
                                                { (job.status != 'Accepted') ? 
                                                    <TableCell>
                                                        {(job.status === 'Pending') ?
                                                            <Button style={{ color: 'green' }} onClick={() => this.shortlist(job.email)}>Shortlist</Button>
                                                            : <Button onClick={() => this.accept(job.email)} style={{ color: 'green' }}>Accept</Button>
                                                        }
                                                        <br />
                                                        <Button style={{ color: 'red' }} onClick={() => this.reject(job.email)}>Reject</Button>
                                                    </TableCell>
                                                 : <p></p>}
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}