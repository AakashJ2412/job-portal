const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Applicant = require("../models/Applicant");
const Recruiter = require("../models/Recruiter");
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            Applicant.findById(jwt_payload.id)
                .then(app => {
                    if (app) {
                        return done(null, app);
                    }
                    Recruiter.findById(jwt_payload.id)
                        .then(appb => {
                            if (appb) {
                                return done(null, appb);
                            }
                            return done(null, false);
                        })
                        .catch(err => console.log(err));
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};
