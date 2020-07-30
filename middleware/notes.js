const User = require('../models/User.js');
const path = require('path');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

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
    });
    req.id = uid;
    next();
}

const filterNotes = async function(notes){
    filtered = []
    notes.forEach((note) => {
        filtered.push({description:note.description,date:note.date,id:note._id});
    })
    return filtered
}

module.exports = {
    getUID,
    filterNotes
}