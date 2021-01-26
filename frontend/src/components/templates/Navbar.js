import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import { UserContext } from "../../UserContext.js"

export default class NavBar extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);
    }

    render() {
        if (this.context.type === 'rec') {
            return (
                <div>
                    <nav className="navbar navbar-expand-md navbar-light bg-light">
                        <Link to="/dashboardrec" className="navbar-brand">Dashboard</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to="/createjob" className="nav-link">Add Job</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/activejob" className="nav-link">Job Postings</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/acceptedapp" className="nav-link">Recruits</Link>
                                </li>
                                <li className="navbar-item">
                                <Link to="/" onClick={this.context.logout} className="nav-link">Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            )
        }
        else if (this.context.type === 'app') {
            return (
                <div>
                    <nav className="navbar navbar-expand-md navbar-light bg-light">
                        <Link to="/dashboardapp" className="navbar-brand">Dashboard</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to="/joblisting" className="nav-link">Job Listings</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/myapplications" className="nav-link">My Applications</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/" onClick={this.context.logout} className="nav-link">Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            )
        }
        else {
            return (
                <div>
                    <nav className="navbar navbar-expand-md navbar-light bg-light">
                        <Link to="/" className="navbar-brand">Home</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            )
        }
    }
}