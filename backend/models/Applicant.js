const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const ApplicantSchema = new Schema({
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
    education:{
		type: [{inst_name:{type:String,required:true},start_year:{type:Number,min:1900,max:2100,required:true},end_year:{type:Number}}],
		required: true
    },
    rating:{
		type: Number,
		min:0,
		max:5,
		required: true,
		default: 0
	},
	rating_cnt:{
		type: Number,
		default:0
	},
	skills:{
		type: [{title:{type:String,required:true}}],
		required: true
	},
	picture: {
		type: String
	}
});

ApplicantSchema.pre('save', function(next){
    var applicant = this;
    if (!applicant.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
        if(err) return next(err);

        bcrypt.hash(applicant.password, salt, function(err, hash){
            if(err) return next(err);
 
            applicant.password = hash;
            next();
        });
    });
});

module.exports = Applicant = mongoose.model("Applicant", ApplicantSchema);