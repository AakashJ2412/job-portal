var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
// Load User model
const Applicant = require("../models/Applicant");
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");

// GET request 
// Getting all the users
router.get("/job", function (req, res) {
    Job.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

router.get("/rec", function (req, res) {
    Recruiter.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

router.get("/app", function (req, res) {
    Applicant.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

router.get("/fuz_search", function (req, res) {
    Job.findOne({ title: req.body.title }, function (err, docs) {
        if (docs.n != 0) {
            return res.status(404).json({
                error: "Job with same title exists",
            });
        }
    }
    );
    Job.fuzzySearch(req.body.title, function (err, srch) {
        if (err) {
            return res.status(404).json({
                error: "Job with same title exists",
            });
        } else {
            res.json(srch)
        }
    }
    );
});


// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 

router.post("/registerjob", (req, res) => {
    Job.findOne({ title: req.body.title }, function (err, docs) {
        if (docs) {
            return res.status(404).json({
                error: "Job with same title exists",
            });
        }
    }
    );
    const newJob = new Job({
        title: req.body.title,
        rec_name: req.body.rec_name,
        rec_email: req.body.rec_email,
        app_no: req.body.app_no,
        pos_no: req.body.pos_no,
        deadline: req.body.deadline,
        skills: req.body.skills,
        duration: req.body.duration,
        salary: req.body.salary,
    });

    newJob.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/registerapp", (req, res) => {
    Applicant.findOne({ email: req.body.email }, function (erra, docsa) {
        if (docsa) {
            return res.status(404).json({
                error: "Applicant with same email exists",
            });
        }
        else {
            Recruiter.findOne({ email: req.body.email }, function (errr, docsr) {
                if (docsr) {
                    return res.status(404).json({
                        error: "Recruiter with same email exists",
                    });
                }
            }
            );
        }
    }
    );
    const newApplicant = new Applicant({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        education: req.body.education,
        skills: req.body.skills
    });

    newApplicant.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/registerrec", (req, res) => {
    Applicant.findOne({ email: req.body.email }, function (erra, docsa) {
        if (docsa) {
            return res.status(404).json({
                error: "Applicant with same email exists",
            });
        }
        else {
            Recruiter.findOne({ email: req.body.email }, function (errr, docsr) {
                if (docsr) {
                    return res.status(404).json({
                        error: "Recruiter with same email exists",
                    });
                }
            }
            );
        }
    }
    );
    const newRecruiter = new Recruiter({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        ph_no: req.body.ph_no,
        bio: req.body.bio
    });

    newRecruiter.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// POST request 
// Login
router.post("/login", (req, res) => {
    if (!req.body.email) {
        return res.status(404).json({
            error: "Invalid input",
        });
    }
    const email = req.body.email;
    const pass = req.body.password
    // Find user by email
    Applicant.findOne({ email }).then(usera => {
        // Check if user email exists
        if (!usera) {
            Recruiter.findOne({ email }).then(userr => {
                // Check if user email exists
                if (!userr) {
                    return res.status(404).json({
                        error: "Email not found",
                    });
                }
                else {
                    // Check password
                    bcrypt.compare(pass, userr.password).then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: userr.id,
                                email: userr.email,
                                type: 'rec'
                            }
                            jwt.sign(payload, keys.secretOrKey,
                                {
                                    expiresIn: 31556926 // 1 year in seconds
                                },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token,
                                        type: "rec"
                                    });
                                }
                            );
                        } else {
                            return res.status(404).json({
                                error: "Incorrect Password",
                            });
                        }
                    });
                }
            });
        }
        else {
            // Check password
            bcrypt.compare(pass, usera.password).then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: usera.id,
                        email: usera.email,
                        type: 'app'
                    }
                    jwt.sign(payload, keys.secretOrKey,
                        {
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token,
                                type: "app"
                            });
                        }
                    );
                } else {
                    return res.status(404).json({
                        error: "Incorrect Password",
                    });
                }
            });
        }
    });
});

router.post("/checklogin", (req, res) => {
    jwt.verify(req.body.token, keys.secretOrKey, function(err, decoded) {
        if (err) {
            return res.status(404).json({
                error: "Token not found",
            });
        }
        res.json({
            token: req.body.token,
            email: decoded.email,
            type: decoded.type
        });
    });
});

// PUT request

router.put("/editjob", (req, res) => {
    Job.findOneAndUpdate({ title: req.body.title }, {
        app_no: req.body.app_no,
        pos_no: req.body.pos_no,
        deadline: req.body.deadline
    }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Job not found",
            });
        }
        else {
            res.send("Successfully edited job")
        }
    });
});

router.put("/editapp", (req, res) => {
    Applicant.findOneAndUpdate({ email: req.body.email }, {
        name: req.body.name,
        education: req.body.education,
        skills: req.body.skills
    }, { new: true }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Applicant not found",
            });
        }
        else {
            res.send("Successfully edited details")
        }
    });
});

router.put("/editrec", (req, res) => {
    Recruiter.findOneAndUpdate({ email: req.body.email }, {
        name: req.body.name,
        ph_no: req.body.ph_no,
        bio: req.body.bio
    }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Recruiter not found",
            });
        }
        else {
            res.send("Successfully edited details")
        }
    });
});

// DELETE request

router.delete("/deljob", (req, res) => {
    Job.deleteOne({ title: req.body.title }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Job not found",
            });
        }
        else {
            res.send("Successfully deleted job")
        }
    });
});

router.delete("/delapp", (req, res) => {
    Applicant.deleteOne({ email: req.body.email }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            res.send("Successfully deleted Applicant")
        }
    });
});

router.delete("/delrec", (req, res) => {
    Recruiter.deleteOne({ email: req.body.email }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            res.send("Successfully deleted Recruiter")
        }
    });
});

module.exports = router;

