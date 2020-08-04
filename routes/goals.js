const User = require('../models/User.js');
const Goal = require('../models/Goal.js');
const Note = require('../models/Note.js')
const path = require('path');
const jwt = require("jsonwebtoken");
const router = require('express').Router({mergeParams:true});
const { getUID } = require('../middleware/goals.js');
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
    let goals = await Goal.find({project:req.params.project}).sort({'date': -1})
    return res.render(__dirname + '/../views/goals.ejs',{goals:goals,members:project.members,isAdmin:user.isAdmin});
});

router.post("/",getUID,async (req,res)=>{
    let goal = new Goal({
        title:req.body.title,
        project:req.params.project,
        deadline:new Date(req.body.deadline),
        date:Date.now() + 1000*60*60*5.5
    })
    await goal.save()
    return res.redirect(`/project/${req.params.project}/goals`)
});

router.post("/resolve",getUID,async (req,res)=>{
    console.log(req.query.id);
    let goal = await Goal.findOne({_id:Types.ObjectId(req.query.id)});
    goal.isCompleted= true;
    await goal.save();
    return res.redirect("/project/"+req.params.project+"/goals");
});

router.post("/delete",getUID,async (req,res)=>{
    console.log(req.query.id);
    await Note.deleteOne({_id:Types.ObjectId(req.query.id)},(err)=>{
        console.log(err)
    });
    return res.redirect("/project/"+req.params.project+"/notes");
});

module.exports = router