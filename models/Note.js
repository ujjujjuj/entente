const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        max:512
	},
	project:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("Note",noteSchema);