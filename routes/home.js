const router = require("express").Router();
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const path = require('path');
const { getUID,sendInvite, filterProject } = require('../middleware/home.js');
const jwt = require('jsonwebtoken');
const { Types } = require("mongoose");

router.get("/home",getUID,async (req,res)=>{
    let user = await User.findOne({_id:req.id});
    let projectIDs = user.projects;
    projects = []
    for(i=0;i<projectIDs.length;i++){
        let project = await Project.findOne({_id:Types.ObjectId(projectIDs[i])})
        projects.push(await filterProject(project))
    }
    return res.render(path.join(__dirname + '/../views/home.ejs'),{projects:projects,isAdmin:user.isAdmin});
});

router.post("/home",getUID,async (req,res)=>{
    let user = await User.findOne({_id:req.id});
    if(!user.isAdmin){
        return res.send("not admin")
    }
    //create and save project + make user admin
    let project = new Project({
        name:req.body.projectName.replace(/\s+/g,"").toLowerCase(),
        description:req.body.description,
        members:[{name:user.name,type:"admin"}],
        date:Date.now() + 1000*60*60*5.5
    });
    let projectExists = await Project.findOne({name:req.body.projectName});
    if(projectExists){
        return res.send("project exists")
    }
    try{
        user.projects.push(project._id);
        await user.save();
        await project.save()
        return res.redirect("/home");
    }catch(e){
        console.log(e)
        return res.send("error")
    }
});

router.get("/:project/invite",getUID,async (req,res) => {
    let user = await User.findOne({_id:req.id});
    let project = await Project.findOne({name:req.params.project});
    if(!project){
        return res.send("project doesnt exist")
    }
    //check if user is admin or not
    project.members.forEach((member)=>{
        if(member.name == user.name){
            if(member.type != "admin"){
                return res.send("not admin")
            }
        }
    });
    //send form
    return res.send("invite form")
});

router.post("/:project/invite", getUID, async (req,res) => {
    let user = await User.findOne({_id:req.id});
    let project = await Project.findOne({name:req.params.project});
    project.members.forEach((member)=>{
        if(member.name == user.name){
            if(member.type != "admin"){
                return res.send("not admin")
            }
        }
    });
    //send invite
    await sendInvite(req,res,project.name,project._id);
})

router.get("/join/:token",async (req,res)=>{
    let data;
    jwt.verify(req.params.token,process.env.JWT_SECRET,(err,authData) => {
        if(err){
			return res.send('invalid link');	
        }
        data = authData;
    });
    let user = await User.findOne({_id:Types.ObjectId(data._id)});
    let project = await Project.findOne({_id:Types.ObjectId(data.projectID)});
    if(user.projects.includes(project._id)){
        return res.redirect('/home')
    }
    user.projects.push(Types.ObjectId(data.projectID));
    project.members.push({name:user.name,type:data.type}) 
    await project.save();
    await user.save();
    res.redirect('/home');
})

module.exports=router;