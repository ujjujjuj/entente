const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		max:255
	},
	extension:{
		type:String,
		required:true
	},
    project:{
        type:String,
		required:true
    },
    data:{
        type:String,
        default:false
    },
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("File",fileSchema);