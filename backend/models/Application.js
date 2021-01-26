const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
    applicant: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    rec_name: {
		type: String,
		required: true
    },
    salary:{
		type: Number,
		min:0,
		required: true
	},
    SOP: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    appdate: {
        type: Date,
        default: Date.now 
    },
    joindate: {
        type: Date
    }
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);