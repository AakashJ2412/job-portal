const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const RecruiterSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
        required: true,
        unique: true
    },
    password : {
        type: String, 
        required : true
    },
	ph_no:{
        type: Number,
		required: true
    },
    bio: {
        type:String,
        maxLength: 250,
        required: true
    }
});

RecruiterSchema.pre('save', function(next){
    var recruiter = this;
    if (!recruiter.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
        if(err) return next(err);

        bcrypt.hash(recruiter.password, salt, function(err, hash){
            if(err) return next(err);
 
            recruiter.password = hash;
            next();
        });
    });
});

module.exports = Recruiter = mongoose.model("Recruiter", RecruiterSchema);