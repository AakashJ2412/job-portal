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

class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    token: null,
    signcheck: false,
    email: null,
    type: null
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
    this.props.history.push('/');
  }

  checklogin = () => {
    const payload = localStorage.getItem('payload');
    if (payload) {
      axios.post('http://localhost:4000/job/checklogin', payload)
        .then((res) => {
          console.log(res.data)
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    }
  }

  componentDidMount() {
    this.checklogin()
  }

  render() {
    const { token, signcheck, email, type } = this.state
    const { setUser, logout } = this
    return (
      <Router>
        <div className="container">
          <UserContext.Provider value={{ token, signcheck, email, type, setUser, logout }}>
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
            <Route path="/acceptedadd" component={acceptedapp} />
            <Route path="/profile" component={Profile} />
          </UserContext.Provider>
        </div>
      </Router>
    )
  }
}

export default App;
