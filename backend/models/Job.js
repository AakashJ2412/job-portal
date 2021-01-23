const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
// Create Schema
const JobSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	rec_name: {
		type: String,
		required: true
	},
	rec_email: {
		type: String,
		required: true
	},
	app_no: {
		type: Number,
		min: 1,
		required: true
	},
	pos_no: {
		type: Number,
		min: 1,
		required: true
	},
	date:{
		type: Date,
		required: false,
		default: Date.now
	},
	deadline:{
		type: Date,
		required: true,
	},
	skills:{
		type: [String],
		required: true
	},
	type_job:{
		type: Number,			// 1 = Full-time, 2 = Part-time, 3 = Work from home
		min:1,
		max:3,
		required: true
	},
	duration:{
		type: Number,
		min:0,
		max:6,
		required: true
	},
	salary:{
		type: Number,
		min:0,
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
		default: 0
	},
	app_id:{
		type: [String]
	},
	acc_id:{
		type: [String]
	}

});
JobSchema.plugin(mongoose_fuzzy_searching, { fields: ['title']});
module.exports = Job = mongoose.model("Job", JobSchema);
