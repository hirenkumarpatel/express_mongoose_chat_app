//importing express
const express = require("express");
//importing body-parser to parse object in json data
const bodyParser = require("body-parser");
//creating instance of express
const app = express();
//importing user controller
const userRouter=require("./routes/userController");
//importing messageRouter
const messageRouter=require("./routes/messageController");
//importing path to access file directories and its path functions
const path = require("path");
const port = process.env.PORT || 3000;
//in order to make soket.io workd we have to include node first and then can connect it to express and socket
//this is node's module
const http = require("http").Server(app);
//imported socket and linked with node
const io = require("socket.io")(http);
//importing mongoose database
const mongoose = require("mongoose");
//to hide some sensetive info like passwords 
const dotenv=require("dotenv");
//to configure dotenv variable to process's environment variable
dotenv.config();
//url of database and credential
const mongooseURL =  process.env.DB_CONNECT;
const mongooseOptions = { useNewUrlParser: true };
// to include promise library to avoid nested callback hell
mongoose.Promise = Promise;
//Middleware function to make static files availbale to web server
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Middleware tto pass route to user router on /user
app.use("/user",userRouter);

//Middleware tto pass route to user router on /user
app.use("/messages",messageRouter);

//handling io on new connection event
io.on("connection", socket => {
  console.log("new user connected:"+socket.id);
  socket.on("disconnect",()=>{
    console.log("user disconnected!");
  });
});
//connecting to database
mongoose.connect(mongooseURL, mongooseOptions, err => {
  if (err) throw err;
  console.log("database conncted!..");
});
//needed to listen to http (node server)insted of app.listen because of link of node to socket and express
http.listen(port, () => {
  console.log(`server is running on port :${port}`);
});
