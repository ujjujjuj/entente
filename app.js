const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();

app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const port = process.env.PORT || 8080;

const config = {
	useUnifiedTopology: true,
  	useNewUrlParser: true
}
mongoose.connect(process.env.DB_URL,config,function(){
    console.log("Connected to db")
});

/*****ROUTES*****/

app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

//login/reg
const authRoute = require("./routes/auth");
app.use("/",authRoute);

app.listen(port,() => {
    console.log("Listening on port "+port);
});