const User = require('../models/User.js')
const path = require('path');

 const registerMiddleware = async function registerMiddleware(req,res,next){

    //redirect if already logged in
    if(req.cookies.auth){
        return res.redirect("/home");
    }
    //check if email exists
    const emailExists = await User.findOne({email:req.body.email});
    if(emailExists){
        return res.render(path.join(__dirname + '/../views/register.ejs'),{error:"Email exists"});
    }
    next();

}

const loginMiddleware = async function loginMiddleware(req,res,next){
    //redirect if already logged in
    if(req.cookies.auth){
        return res.redirect("/home");
    }
    //check if email exists
    const emailExists = await User.findOne({email:req.body.email});
    if(!emailExists){
        return res.render(path.join(__dirname + '/../views/login.ejs'),{error:"Email does not exist"});
    }
    next();
}

module.exports = {
    loginMiddleware,
    registerMiddleware
}