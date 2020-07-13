const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const { registerMiddleware,loginMiddleware } = require('../middleware/auth.js');

router.get("/register",(req,res) => {

    //check if already logged in
    if(req.cookies['auth']!=null){
        return res.redirect("/home");
    };

    return res.render(path.join(__dirname + '/../views/register.ejs'),{error:[]});
});

router.post("/register",registerMiddleware,async (req,res) => {

    //hash password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password,salt);
    //create user
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        isAdmin:false,
        date:Date.now() + 1000*60*60*5.5
    });
    //save user and assign jwt
    try{
        await user.save();
        let token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie("auth",token,{maxAge:2*24*60*60*1000});
        return res.redirect("/home");
    }catch(e){
        console.log(e)
        return res.render(path.join(__dirname + '/../views/register.ejs'),{error:"error"});
    }
    
});

router.get("/login",(req,res) => {

    //check if already logged in
    if(req.cookies['auth']!=null){
        return res.redirect("/home");
    };

    return res.render(path.join(__dirname + '/../views/login.ejs'),{error:[]});
});

router.post("/login",loginMiddleware,async (req,res) => {

    //check if password is correct
    let user = await User.findOne({email:req.body.email})
    const validPass = await bcrypt.compare(req.body.password, user.password);
    console.log(validPass)
    if(!validPass){
        return res.render(path.join(__dirname + '/../views/login.ejs'),{error:"Incorrect password"});
    }
    //create token and set cookie
	const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.cookie("auth",token,{maxAge:2*24*60*60*1000});
	return res.redirect("/home");
    
});

module.exports=router;