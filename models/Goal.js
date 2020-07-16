const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
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
    isCompleted:{
        type:Boolean,
        default:false
    },
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("Goal",goalSchema);