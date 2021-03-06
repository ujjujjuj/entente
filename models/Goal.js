const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
	title:{
		type:String,
		required:true,
		max:255
    },
    project:{
        type:String,
		required:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    deadline:{
        type:Date,
        required:true
    },
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("Goal",goalSchema);