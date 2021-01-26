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
import DateTimePicker from 'react-datetime-picker';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

export default class activejob extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            jobs: [],
            name: '',
            email: ''
        }
        this.editJob = this.editJob.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.viewJob = this.viewJob.bind(this);
        this.onChangeAppno = this.onChangeAppno.bind(this);
        this.onChangePosno = this.onChangePosno.bind(this);
        this.onChangeDeadline = this.onChangeDeadline.bind(this);
    }

    getData = async () => {
        try {
            const alljobs = await axios.get('http://localhost:4000/job/getjobrec', { headers: { email: this.context.email } });
            console.log('this is data')
            console.log(alljobs)
            if (alljobs) {
                this.setState({
                    jobs: alljobs.data
                });
            }
        }
        catch {
            alert('Error loading data');
            this.props.history.push('/dashboardrec');
        }
    }

    componentDidMount() {
        this.getData();
    }

    onChangeAppno(event, app_title) {
        let tempjob = this.state.jobs;
        let temp = tempjob.find(jo => jo.title === app_title).app_no = event.target.value;
        this.setState({
            jobs: tempjob
        }); 
    }

    onChangePosno(event, app_title) {
        let tempjob = this.state.jobs;
        tempjob.find(jo => jo.title === app_title).pos_no = event.target.value;
        this.setState({
            jobs: tempjob
        }); 
    }

    onChangeDeadline(event, app_title) {
        let tempjob = this.state.jobs;
        tempjob.find(jo => jo.title === app_title).deadline = new Date(event);
        this.setState({
            jobs: tempjob
        }); 
    }

    editJob(app_title){
        let tempjob = this.state.jobs.find(appjob => (appjob.title === app_title));
        if (tempjob.app_no < tempjob.cur_app || tempjob.pos_no < tempjob.cur_pos || tempjob.app_no < tempjob.pos_no) {
            alert('Invalid Update');
        }
        else {
            axios.put('http://localhost:4000/job/editjob', tempjob)
            .then(res => {
                alert("Successfully Updated Job Details");
                console.log(res.data);
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
        }
    }

    deleteJob(app_title) {
        console.log(app_title)
        axios.post('http://localhost:4000/job/deljob', {title: app_title})
            .then(res => {
                alert("Successfully Deleted Job");
                console.log(res.data);
                window.location.reload();
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }
    viewJob(app_title) {
            this.props.history.push(`/currentapp/${app_title}`);
    }

    customFunction = async (e) => {
        try {
            const str = e.target.value
            this.setState({ searchtext: e.target.value });
            if (str != "") {
                console.log('going fuz')
                const updjobs = await axios.get('http://localhost:4000/job/fuz_search', { headers: { title: str } });
                console.log(updjobs);
                if (updjobs) {
                    const tempdate = new Date();
                    const valjobs = updjobs.data.filter(updjob => new Date(updjob.deadline) > tempdate);
                    this.setState({
                        jobs: valjobs,
                        dispjobs: valjobs
                    });
                }
            }
            else {
                console.log('going all')
                const updjobs = await axios.get('http://localhost:4000/job/job');
                console.log(updjobs);
                if (updjobs) {
                    const tempdate = new Date();
                    const valjobs = updjobs.data.filter(updjob => new Date(updjob.deadline) > tempdate);
                    this.setState({
                        jobs: valjobs,
                        dispjobs: valjobs
                    });
                }
            }
        }
        catch {
            alert('Error loading data');
            this.props.history.push('/dashboardapp');
        }
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
                                        <TableCell>Title</TableCell>
                                        <TableCell>Date of Posting</TableCell>
                                        <TableCell>Max No. of Applicants</TableCell>
                                        <TableCell>Max No. of Positions</TableCell>
                                        <TableCell>No. of Applicants</TableCell>
                                        <TableCell>No. of Positions filled</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.jobs.map((job, ind) => (
                                            <TableRow key={ind}>
                                                <TableCell>{job.title}</TableCell>
                                                <TableCell>{new Intl.DateTimeFormat("en-GB", { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(job.date))}</TableCell>
                                                <TableCell>
                                                    <input type="number"
                                                    className="form-control"
                                                    value={job.app_no}
                                                    onChange={(event) => {this.onChangeAppno(event, job.title)}}
                                                />
                                                </TableCell>
                                                <TableCell>
                                                    <input type="number"
                                                        className="form-control"
                                                        value={job.pos_no}
                                                      onChange={(event) => {this.onChangePosno(event, job.title)}}
                                                    />
                                                </TableCell>
                                                <TableCell>{job.cur_app}</TableCell>
                                                <TableCell>{job.cur_pos}</TableCell>
                                                <TableCell className="pr-5 mr-5"><DateTimePicker onChange={(event) => {this.onChangeDeadline(event, job.title)}} value={new Date(job.deadline)} /></TableCell>
                                                <TableCell><Button onClick={() => this.editJob(job.title)}>Edit</Button></TableCell>
                                                <TableCell><Button onClick={() => this.deleteJob(job.title)} >Delete</Button></TableCell>
                                                <TableCell><Button onClick={() => this.viewJob(job.title)}>View</Button></TableCell>
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