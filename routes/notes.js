const User = require('../models/User.js');
const Note = require('../models/Note.js')
const path = require('path');
const jwt = require("jsonwebtoken");
const router = require('express').Router({mergeParams:true});
const { getUID,filterNotes } = require('../middleware/notes.js');
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
    let notes = await Note.find({project:req.params.project}).sort({'date': -1})
    notes = await filterNotes(notes);
    return res.render(__dirname + '/../views/notes.ejs',{notes:notes,members:project.members,isAdmin:user.isAdmin});
});

router.post("/",getUID,async (req,res)=>{
    let note = new Note({
        description:req.body.description.replace(/\r|\n/g," "),
        project:req.params.project,
        date:Date.now() + 1000*60*60*5.5
    })
    await note.save()
    return res.redirect(`/project/${req.params.project}/notes`)
});
router.post("/delete",getUID,async (req,res)=>{
    console.log(req.query.id);
    await Note.deleteOne({_id:Types.ObjectId(req.query.id)},(err)=>{
        console.log(err)
    });
    return res.redirect("/project/"+req.params.project+"/notes");
});

module.exports = router