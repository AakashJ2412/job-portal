import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import { UserContext } from "./UserContext";
import axios from 'axios';
import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Navbar from './components/templates/Navbar'
import Profile from './components/Users/Profile'
import dashboardapp from './components/Applicant/dashboardapp'
import joblisting from './components/Applicant/joblisting'
import myapplications from './components/Applicant/myapplications'
import dashboardrec from './components/Recruiter/dashboardrec'
import createjob from './components/Recruiter/createjob'
import acceptedapp from './components/Recruiter/acceptedapp'
import activejob from './components/Recruiter/activejob'
import jobapp from './components/Applicant/jobapp'
import currentapp from './components/Recruiter/currentapp'

class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    loadvar: false,
    token: null,
    signcheck: false,
    email: null,
    type: null,
    details: null
  }

  setUser = (token, boolchk, email, type) => {
    this.setState({
      token: token,
      signcheck: boolchk,
      email: email,
      type: type
    });
  }

  logout = () => {
    this.setState({
      token: null,
      signcheck: false,
      email: null,
      type: null
    });
    localStorage.removeItem('payload');
    console.log('logout');
  }

  checklogin = async () => {
    try {
      console.log(this.state)
      const payload = localStorage.getItem('payload');
      if (payload) {
        const res = await axios.post('http://localhost:4000/job/checklogin', { token: payload });
        if (res.data) {
          console.log(res)
          this.setState({
            token: res.data.token,
            signcheck: true,
            email: res.data.email,
            type: res.data.type
          });
          console.log(this.state)
        }
      }
    }
    catch (error) {
    }
    finally {
      this.setState({ loadvar: true })
    }
  }

  componentDidMount() {
    console.log('start app')
    this.checklogin()
    console.log('end app')
  }

  render() {
    const { token, signcheck, email, type, details } = this.state
    const { setUser, logout } = this
    return (
      <Router>
        <div className="container">
          <UserContext.Provider value={{ token, signcheck, email, type, setUser, logout }}>
            {this.state.loadvar ? <div>
              <Navbar />
              <br />
              <Route path="/" exact component={Home} />
              <Route path="/users" exact component={UsersList} />
              <Route path="/register" component={Register} />
              <Route path="/dashboardapp" component={dashboardapp} />
              <Route path="/dashboardrec" component={dashboardrec} />
              <Route path="/joblisting" component={joblisting} />
              <Route path="/myapplications" component={myapplications} />
              <Route path="/createjob" component={createjob} />
              <Route path="/activejob" component={activejob} />
              <Route path="/acceptedapp" component={acceptedapp} />
              <Route path="/profile" component={Profile} />
              <Route path="/jobapp" component={jobapp} />
              <Route path="/currentapp" component={currentapp} />
            </div>
              :
              <div>
                Loading...
              </div>
            }
          </UserContext.Provider>
        </div>
      </Router>
    )
  }
}

export default App;
