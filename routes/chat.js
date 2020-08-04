const User = require('../models/User.js');
const path = require('path');
const jwt = require("jsonwebtoken");
const router = require('express').Router({mergeParams:true});
const { getUID } = require('../middleware/files.js');
const Project = require('../models/Project.js');
const { Types } = require("mongoose");


router.get("/",getUID,async (req,res)=>{
    let user = await User.findOne({_id:req.id});
    let project = await Project.findOne({name:req.params.project})
    if(!project){
        res.send("project doesnt exist");
    }
    if(!user.projects.includes(project._id)){
        return res.send("not member");
    }
    return res.render(__dirname + '/../views/chat.ejs',{members:project.members,isAdmin:user.isAdmin});
});

module.exports = router