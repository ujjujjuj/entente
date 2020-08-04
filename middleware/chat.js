const User = require('../models/User.js');
const jwt = require("jsonwebtoken");
const auth = require('./auth.js');

const getUsername = async (id) => {
    let name;
    await jwt.verify(id,process.env.JWT_SECRET,async (err,authData) => {
        if(err){
			console.log(err);
        }
        let user = await User.findOne({_id:authData._id});
        name = user.name
    });
    return name
}

module.exports = {
    getUsername
}