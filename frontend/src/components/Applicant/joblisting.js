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
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default class joblisting extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            jobs: [],
            dispjobs: [],
            appjobs: [],
            name: '',
            email: '',
            searchtext: '',
            salsortvar: 0,
            dursortvar: 0,
            typefilter: '',
            lsalfilter: 0,
            hsalfilter: 0,
            durfilter: 0
        }
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeHsal = this.onChangeHsal.bind(this);
        this.onChangeLsal = this.onChangeLsal.bind(this);
        this.onChangeDur = this.onChangeDur.bind(this);
        this.clearFilt = this.clearFilt.bind(this);
        this.apply = this.apply.bind(this);
    }

    onChangeType(event) {
        const temp = event.target.value;
        this.setState({ typefilter: event.target.value });
        console.log(temp)
        const temparr = this.state.jobs.filter(a => a.type_job === temp);
        console.log(temparr)
        this.setState({
            dispjobs: temparr
        });
    }

    onChangeHsal(event) {
        const temp = event.target.value;
        this.setState({ hsalfilter: event.target.value });
        console.log(temp)
        const temparr = this.state.jobs.filter(a => a.salary <= temp);
        console.log(temparr)
        this.setState({
            dispjobs: temparr
        });
    }

    onChangeLsal(event) {
        const temp = event.target.value;
        this.setState({ lsalfilter: event.target.value });
        console.log(temp)
        const temparr = this.state.jobs.filter(a => a.salary >= temp);
        console.log(temparr)
        this.setState({
            dispjobs: temparr
        });
    }
    onChangeDur(event) {
        const temp = event.target.value;
        this.setState({ durfilter: event.target.value });
        console.log(temp)
        const temparr = this.state.jobs.filter(a => a.duration < temp);
        console.log(temparr)
        this.setState({
            dispjobs: temparr
        });
    }

    clearFilt(event) {
        console.log(this.state.appjobs)
        const temp = this.state.jobs
        this.setState({
            dispjobs: temp,
            typefilter: '',
            lsalfilter: 0,
            hsalfilter: 0,
            durfilter: 0
        });
    }
    getData = async () => {
        try {
            const alljobs = await axios.get('http://localhost:4000/job/job');
            if (alljobs) {
                const tempdate = new Date();
                const valjobs = alljobs.data.filter(alljob => new Date(alljob.deadline) > tempdate);
                this.setState({
                    jobs: valjobs,
                    dispjobs: valjobs
                });
                const appjob = await axios.get('http://localhost:4000/job/appjob', { headers: { email: this.context.email } });
                console.log(appjob)
                this.setState({
                    appjobs: appjob.data
                })
            }
        }
        catch {
            alert('Error loading data');
            this.props.history.push('/dashboardapp');
        }
    }

    componentDidMount() {
        this.getData();
    }

    sortSalary = () => {
        const array = this.state.dispjobs;
        if (this.state.salsortvar === 0) {
            array.sort(function (a, b) {
                return a.salary - b.salary;
            });
            this.setState({
                dispjobs: array,
                salsortvar: 1
            });
        } else {
            array.sort(function (a, b) {
                return b.salary - a.salary;
            });
            this.setState({
                dispjobs: array,
                salsortvar: 0
            });
        }
    }
    sortDuration = () => {
        const array = this.state.dispjobs;
        if (this.state.dursortvar === 0) {
            array.sort(function (a, b) {
                return a.duration - b.duration;
            });
            this.setState({
                dispjobs: array,
                dursortvar: 1
            });
        } else {
            array.sort(function (a, b) {
                return b.duration - a.duration;
            });
            this.setState({
                dispjobs: array,
                dursortvar: 0
            });
        }
    }
    renderIconSal() {
        if (this.state.salsortvar === 0) {
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
    renderIconDur() {
        if (this.state.dursortvar === 0) {
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

    apply(app_title) {
        let check = this.state.appjobs.filter(appjob => (appjob.status === 'Pending' || appjob.status === 'Shortlisted'));
        let acccheck = this.state.appjobs.filter(appjob => (appjob.status === 'Accepted'));
        if(check.length > 9) {
            alert('You have 10 pending applications.');
        }
        else if(acccheck.length > 0) {
            alert('You have already been accepted to a job.');
        }
        else {
            this.props.history.push(`/jobapp/${app_title}`);
        }
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
                    <Grid item xs={12} md={3} lg={3}>
                        <List component="nav" aria-label="mailbox folders">
                            <ListItem>
                                <h3>Filters</h3>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <List component="nav" aria-label="mailbox folders">
                            <TextField
                                id="standard-basic"
                                label="Search"
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                onInput={this.customFunction}
                            />
                        </List>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={3} lg={3}>
                        <List component="nav" aria-label="mailbox folders">

                            <ListItem button>
                                <form noValidate autoComplete="off">
                                    <label>Salary</label>
                                    <TextField type="number" id="standard-basic" label="Enter Min" fullWidth={true} value={this.state.lsalfilter} onChange={this.onChangeLsal} />
                                    <TextField type="number" id="standard-basic" label="Enter Max" fullWidth={true} value={this.state.hsalfilter} onChange={this.onChangeHsal} />
                                </form>
                            </ListItem>
                            <Divider />
                            <div className="pt-3 px-3">
                                <label>Duration of Job: </label>
                                <select value={this.state.durfilter} onChange={this.onChangeDur} className="form-control" required>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </div>
                            <Divider />
                            <div className="pt-3 px-3">
                                <label>Type of Job: </label>
                                <div onChange={this.onChangeType}>
                                    <input type="radio" value="Full-time" name="gender" /> Full-time <br />
                                    <input type="radio" value="Part-time" name="gender" /> Part-time <br />
                                    <input type="radio" value="Work from home" name="gender" /> Work from home <br />
                                </div>
                            </div>
                            <Divider />
                            <Button className="pt-3 px-5 ml-3" onClick={this.clearFilt}>Clear Filters</Button>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {/*<TableCell> <Button onClick={this.sortChange}>{this.renderIcon()}</Button>Date</TableCell>*/}
                                        <TableCell>Title</TableCell>
                                        <TableCell>Recruiter Name</TableCell>
                                        <TableCell>Recruiter Email</TableCell>
                                        <TableCell><Button onClick={this.sortSalary}>{this.renderIconSal()}</Button>Salary</TableCell>
                                        <TableCell><Button onClick={this.sortDuration}>{this.renderIconDur()}</Button>Duration</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell>Application Status</TableCell>
                                        {/*<TableCell>Confidence</TableCell>*/}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.dispjobs.map((job, ind) => (
                                            <TableRow key={ind}>
                                                <TableCell>{job.title}</TableCell>
                                                <TableCell>{job.rec_name}</TableCell>
                                                <TableCell>{job.rec_email}</TableCell>
                                                <TableCell>{job.salary}</TableCell>
                                                <TableCell>{job.duration}</TableCell>
                                                <TableCell>{new Intl.DateTimeFormat("en-GB", { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(job.deadline))}</TableCell>
                                                {/*<TableCell>{job.confidenceScore}</TableCell>*/}
                                                <TableCell>
                                                {(this.state.appjobs.find(appjob => appjob.job === job.title)) ?
                                                    <Button style={{ color : 'grey'}} disabled>Applied</Button>
                                                    :  (job.cur_app < job.app_no && job.cur_pos < job.pos_no) ? <Button onClick={() => this.apply(job.title)} style={{ color : 'green'}}>Apply</Button>
                                                    : <Button style={{ color : 'red'}} disabled>Full</Button>
                                                }
                                                </TableCell>
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