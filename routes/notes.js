const User = require('../models/User.js');
const Note = require('../models/Note.js')
const path = require('path');
const jwt = require("jsonwebtoken");
const router = require('express').Router({mergeParams:true});
const { getUID,filterNotes } = require('../middleware/notes.js');
const Project = require('../models/Project.js');

router.get("/",async (req,res)=>{
    let project = await Project.findOne({name:req.params.project})
    if(!project){
        res.send("project doesnt exist");
    }
    let notes = await Note.find({project:req.params.project})
    notes = await filterNotes(notes);
    return res.render(__dirname + '/../views/notes.ejs',{notes:notes,members:project.members});
});

router.post("/",getUID,async (req,res)=>{
    let note = new Note({
        description:req.body.description,
        project:req.params.project,
        date:Date.now() + 1000*60*60*5.5
    })
    await note.save()
    return res.send("post notes");
});

module.exports = router