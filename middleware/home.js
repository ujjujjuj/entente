const User = require('../models/User.js');
const path = require('path');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const auth = require('./auth.js');

//nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
});

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
        
        console.log(authData)
    });
    req.id = uid;
    next();
}

const sendInvite = async function(req,res,projectName,projectID){

    let user = await User.findOne({email:req.body.email});
    if(!user){
        return res.send("user doesnt exist");
    }
    //create invite link
    let token = jwt.sign({"_id":user._id,projectID:projectID,type:req.body.type},process.env.JWT_SECRET);
    let url = `https://entente-inc.herokuapp.com/join/${token}`;
    let mailOptions = {
        from: "Entente Inc.",
        to: user.email,
        subject: "Join Project",
        text: (`Hello,\nYou have been invited to join ${projectName}.\nPlease click on this link to proceed\n`+url)
    };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log(info)
            
        }
    });
    next();
}

const filterProject = async function(project){
    return {name:project.name,members:project.members.length,description:project.description}
}

module.exports = {
    getUID,
    sendInvite,
    filterProject
}