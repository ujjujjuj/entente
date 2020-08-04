const User = require('../models/User.js');
const jwt = require("jsonwebtoken");

const getUID = async function(req,res,next){
    //redirect if not logged in
    if(!req.cookies.auth){
        return res.redirect("/login");
    }
    let token = req.cookies.auth;
    let uid;
    jwt.verify(token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.redirect('/logout');	
		}
        if(authData._id){
            uid = authData._id;
        }else{
            uid = authData.id;
        }
    });
    req.id = uid;
    next();
}

module.exports = {
    getUID
}