const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		max:255
	},
	email:{
		type:String,
		required:true,
		max:1024
	},
	password:{
		type:String,
		required:true,
		max:255
	},
    organization:{
        type:String,
        default:null,
        max:255
    },
	isAdmin:{
		type:Boolean,
		default:false
	},
	date:{
		type:Date,
		required:true
	}
});

module.exports = mongoose.model("User",userSchema);