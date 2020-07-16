const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		max:255
	},
	members:{
		type:Array,
		default:[]
	},
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("Project",projectSchema);