const express = require("express");
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

const { getUsername } = require('./middleware/chat.js');

const dotenv = require("dotenv");
dotenv.config();

app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
app.use(sslRedirect());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const port = process.env.PORT || 8080;
//database setup
const config = {
	useUnifiedTopology: true,
  	useNewUrlParser: true
}
mongoose.connect(process.env.DB_URL,config,function(){
    console.log("Connected to db")
});

/*****ROUTES*****/

app.get("/",(req,res) => {
    res.redirect("/home")
   // res.sendFile(path.join(__dirname + '/views/index.html'));
});

//project(view projects/create new ones)
const projectRoute = require("./routes/home")
app.use("/",projectRoute);

//login/reg
const authRoute = require("./routes/auth");
app.use("/",authRoute);

//notes(view/create)
const notesRoute = require('./routes/notes')
app.use("/project/:project/notes",notesRoute)

//goals(view/create)
const goalsRoute = require('./routes/goals')
app.use("/project/:project/goals",goalsRoute)

//files(view/upload)
const filesRoute = require('./routes/files')
app.use("/project/:project/files",filesRoute)

//chat
const chatRoute = require('./routes/chat')
app.use("/project/:project/chat",chatRoute)

//video
const videoRoute = require('./routes/video')
app.use("/project/:project/video",videoRoute)

//******** CHAT AND VIDEO ********//
io.on("connection",async (socket) => {
    console.log("new connection!");
    let chatRoom;
    let videoRoom;
    let uid;
    //******** CHAT ********//

    socket.on("register",(room)=>{
        console.log("joined",room)
        chatRoom = room
        socket.join(room)
    })

    socket.on("message",async (data)=>{
        let username = await getUsername(data._id)
        socket.to(chatRoom).broadcast.emit('incoming',{name:username,message:data.message})
        socket.emit("incoming",{name:"You",message:data.message})
    })

    //******** VIDEO ********//
    socket.on("joinRoom",(data)=>{
        videoRoom = data.room;
        socket.join(videoRoom)
        uid = data.id
        socket.to(videoRoom).broadcast.emit("newVideo",uid);
        console.log(data)
    })
    
    socket.on("disconnect",()=> {
        console.log(uid)
        socket.to(videoRoom).broadcast.emit("userDisconnected",uid)
    })

})

server.listen(port,() => {
    console.log("Listening on port "+port);
});