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
const Application = require("../models/Application");
const { application } = require("express");

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

router.get("/appl", function (req, res) {
    Application.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

router.get("/appjob", async (req, res) => {
    appl = await Application.find({ applicant: req.headers.email });
    res.json(appl)
});

router.get("/titlejob", async (req, res) => {
    appl = await Application.find({ job: req.headers.title });
    res.json(appl)
});

router.get("/getjobrec", async (req, res) => {
    appl = await Job.find({ rec_email: req.headers.email });
    res.json(appl)
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

router.get("/getjob", async (req, res) => {
    console.log(req.headers.title)
    job = await Job.findOne({ title: req.headers.title });
    if (!job) {
        return res.status(404).json({
            error: "Job not Found",
        });
    } else {
        res.json(job);
    }
});

router.get("/getapp", async (req, res) => {
    console.log(req.headers.email)
    applicant = await Applicant.findOne({ email: req.headers.email });
    if (!applicant) {
        return res.status(404).json({
            error: "Applicant not Found",
        });
    } else {
        res.json(applicant);
    }
});

router.get("/getrec", async (req, res) => {
    console.log(req.headers.email)
    recruiter = await Recruiter.findOne({ email: req.headers.email });
    if (!recruiter) {
        return res.status(404).json({
            error: "Recruiter not Found",
        });
    } else {
        //console.log(recruiter)
        res.json(recruiter);
    }
});

router.get("/fuz_search", function (req, res) {
    Job.fuzzySearch(req.headers.title, function (err, srch) {
        if (err) {
            return res.status(404).json({
                error: "Error while searching",
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
        type_job: req.body.type_job,
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
        skills: req.body.skills,
        picture: req.body.picture
    });

    newApplicant.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/apply", (req, res) => {
    Application.findOne({ applicant: req.body.email, job: req.body.title }, function (err, docs) {
        if (docs === null) {
            const newApplication = new Application({
                applicant: req.body.email,
                job: req.body.title,
                SOP: req.body.SOP,
                rec_name: req.body.rec_name,
                salary: req.body.salary,
                joindate: req.body.joindate
            });
            Job.findOneAndUpdate({ title: req.body.title },
                { $inc: { 'cur_app': 1 } },
                { new: true, useFindAndModify: false }, function (err, upd) {
                    if (err) {
                        return res.status(404).json({
                            error: "Job count not updated",
                        });
                    }
                });
            newApplication.save()
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }
        else {
            return res.status(404).json({
                error: "Application already exists",
            });
        }
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
                                        token: token,
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
                                token: token,
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
    jwt.verify(req.body.token, keys.secretOrKey, function (err, decoded) {
        if (decoded.type === 'app' || decoded.type === 'rec') {
            res.json({
                token: req.body.token,
                email: decoded.email,
                type: decoded.type
            });
        }
        else {
            return res.status(404).json({
                error: "Token not found",
            });
        }
    });
});

// PUT request

router.put("/editjob", (req, res) => {
    Job.findOneAndUpdate({ title: req.body.title }, {
        app_no: req.body.app_no,
        pos_no: req.body.pos_no,
        deadline: req.body.deadline
    }, { useFindAndModify: false }, function (err) {
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

router.put("/updstat", (req, res) => {
    Application.findOneAndUpdate({ applicant: req.body.email, job: req.body.title }, {
        status: req.body.status
    }, { useFindAndModify: false }, function (err) {
        if (err) {
            return res.status(404).json({
                error: "Application not found",
            });
        }
        else {
            if (req.body.status === "Accepted") {
                Job.findOneAndUpdate({ title: req.body.title },
                    { $inc: { 'cur_pos': 1 } },
                    { new: true, useFindAndModify: false }, function (err, upd) {
                        if (err) {
                            return res.status(404).json({
                                error: "Job count not updated",
                            });
                        } else {
                            res.send("Successfully updated application status");
                        }
                    });
            } else {
                res.send("Successfully updated application status");
            }
        }
    });
});

router.put("/editapp", (req, res) => {
    Applicant.findOneAndUpdate({ email: req.body.email }, {
        name: req.body.name,
        education: req.body.education,
        skills: req.body.skills,
        picture: req.body.picture
    }, { new: true, useFindAndModify: false }, function (err, upd) {
        console.log(err)
        if (err) {
            return res.status(404).json({
                error: "Applicant not found for edit",
            });
        }
        else {
            res.json(upd)
        }
    });
});

router.put("/editrec", (req, res) => {
    //console.log(req.body.email)
    Recruiter.findOneAndUpdate({ email: req.body.email }, {
        name: req.body.name,
        ph_no: req.body.ph_no,
        bio: req.body.bio
    }, { new: true, useFindAndModify: false }, function (err, upd) {
        if (err) {
            return res.status(404).json({
                error: "Recruiter not found for edit",
            });
        }
        else {
            res.json(upd)
        }
    });
});

// DELETE request

router.post("/deljob", (req, res) => {
    Job.deleteOne({ title: req.body.title }, function (err, docs) {
        if (err) {
            return res.status(404).json({
                error: "Job not found",
            });
        }
        else {
            Application.updateMany({ job: req.body.title }, { status: 'Deleted' }, function (erru, docsu) {
                if (err) {
                    return res.status(404).json({
                        error: "Status failed",
                    });
                }
                else {
                    res.send("Successfully deleted job");
                }
            });
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

