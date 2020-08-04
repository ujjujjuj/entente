const User = require('../models/User.js');
const File = require('../models/File.js')
const path = require('path');
const jwt = require("jsonwebtoken");
const router = require('express').Router({mergeParams:true});
const { getUID } = require('../middleware/files.js');
const Project = require('../models/Project.js');
const { Types } = require("mongoose");
const stream = require('stream');


router.get("/",getUID,async (req,res)=>{
    let user = await User.findOne({_id:req.id});
    let project = await Project.findOne({name:req.params.project})
    if(!project){
        res.send("project doesnt exist");
    }
    if(!user.projects.includes(project._id)){
        return res.send("not member");
    }
    let files = await File.find({project:req.params.project},{"data":0}).sort({'date': -1})
    return res.render(__dirname + '/../views/files.ejs',{files:files,members:project.members,isAdmin:user.isAdmin});
});

router.post("/",getUID,async (req,res)=>{
    console.log(req.files.file.name.split(".").pop())
    let file = new File({
        name:req.body.name,
        extension:req.files.file.name.split(".").pop(),
        project:req.params.project,
        data:(req.files.file.data.toString("base64")),
        date:Date.now() + 1000*60*60*5.5
    })
    await file.save()
    return res.redirect(`/project/${req.params.project}/files`)
});

router.get("/download",getUID,async (req,res)=>{
    file = await File.findOne({_id:Types.ObjectId(req.query.id)})
    if(!file){
        return res.send("cannot find file")
    }
    buff = new Buffer.alloc(file.data.length,file.data,"base64");
    let readStream = new stream.PassThrough();
    readStream.end(buff);
    res.set('Content-disposition', 'attachment; filename=' + file.name+"."+file.extension);
    res.set('Content-Type', 'text/plain');

    readStream.pipe(res);
});

module.exports = router