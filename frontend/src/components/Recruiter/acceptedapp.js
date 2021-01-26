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

export default class acceptedapp extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            appl: [],
            namesortvar: 0,
            datesortvar: 0,
            titlesortvar: 0
        }
    }

    getData = async () => {
        try {
            const alljobs = await axios.get('http://localhost:4000/job/getjobrec', { headers: { email: this.context.email } });
            const appl = await axios.get('http://localhost:4000/job/appl');
            const allapp = await axios.get('http://localhost:4000/job/app');
            let data = []
            alljobs.data.map((job) => {
                    appl.data.map((application) => {
                        console.log(application)
                        if(application.status === "Accepted" && application.job === job.title) {
                            allapp.data.map((applicant) => {
                                if(applicant.email === application.applicant) {
                                    data.push({
                                        name: applicant.name,
                                        email: applicant.email,
                                        joindate: application.joindate,
                                        job_type: job.type_job,
                                        title: job.title
                                    })
                                }
                            })
                        }
                    })
            });
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
    sortTitle = () => {
        const array = this.state.appl;
        if (this.state.titlesortvar === 0) {
            array.sort(function (a, b) {
                if (a.title < b.title) { return -1; }
                if (a.title > b.title) { return 1; }
                return 0;
            });
            this.setState({
                appl: array,
                titlesortvar: 1
            });
        } else {
            array.sort(function (a, b) {
                if (a.title < b.title) { return 1; }
                if (a.title > b.title) { return -1; }
                return 0;
            });
            this.setState({
                appl: array,
                titlesortvar: 0
            });
        }
    }
    sortDate = () => {
        const array = this.state.appl;
        if (this.state.datesortvar === 0) {
            array.sort((a, b) => new Date(a.joindate) - new Date(b.joindate));
            this.setState({
                appl: array,
                datesortvar: 1
            });
        } else {
            array.sort((a, b) => new Date(b.joindate) - new Date(a.joindate));
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
    renderIconTitle() {
        if (this.state.titlesortvar === 0) {
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

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Button onClick={this.sortName}>{this.renderIconName()}</Button><br />Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell><Button onClick={this.sortDate}>{this.renderIconDate()}</Button><br />Date of Joining</TableCell>
                                        <TableCell>Job Type</TableCell>
                                        <TableCell><Button onClick={this.sortTitle}>{this.renderIconTitle()}</Button><br />Job Title</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.appl.map((job, ind) => (
                                            <TableRow key={ind}>
                                                <TableCell>{job.name}</TableCell>
                                                <TableCell>{job.email}</TableCell>
                                                <TableCell>{new Intl.DateTimeFormat("en-GB", { dateStyle: 'medium' }).format(new Date(job.joindate))}</TableCell>
                                                <TableCell>{job.job_type}</TableCell>
                                                <TableCell>{job.title}</TableCell>
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