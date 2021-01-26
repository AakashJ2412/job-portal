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

export default class myapplications extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            jobs: []
        }
    }

    getData = async () => {
        try {
            let appjob = await axios.get('http://localhost:4000/job/appjob', { headers: { email: this.context.email } });
            this.setState({
                jobs: appjob.data
            });
        }
        catch {
            alert('Error loading data');
            this.props.history.push('/dashboardapp');
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div>
                <Grid container>
                    <div className="d-flex justify-content-centre py-3">
                        <h1>My Applications</h1>
                    </div>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Recruiter Name</TableCell>
                                        <TableCell>Date of Joining</TableCell>
                                        <TableCell>Salary</TableCell>
                                        <TableCell>Application Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.jobs.map((ajob, ind) => (
                                            <TableRow key={ind}>
                                                <TableCell>{ajob.job}</TableCell>
                                                <TableCell>{ajob.rec_name}</TableCell>
                                                <TableCell>{(ajob.joindate) ? new Intl.DateTimeFormat("en-GB", { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(ajob.joindate)) : <p></p>}</TableCell>
                                                <TableCell>{ajob.salary}</TableCell>
                                                <TableCell>{ajob.status}</TableCell>
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