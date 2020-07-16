const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		max:255
    },
    description:{
        type:String,
        required:true,
        max:512
    },
    isResolved:{
        type:Boolean,
        default:false
    },
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("Issue",issueSchema);