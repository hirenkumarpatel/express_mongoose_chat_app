//importing express
const express = require("express");
//importing body-parser to parse object in json data
const bodyParser = require("body-parser");
//express handlebars area to handle partial html view rendered in html page
const expHandlebars=require("express-handlebars");
//importing session
const session=require("client-sessions");
//importing user controller
const userRouter = require("./routes/userController");
//importing messageRouter
const messageRouter = require("./routes/messageController");
//importing path to access file directories and its path functions
const path = require("path");
const port = process.env.PORT || 3000;
//in order to make soket.io workd we have to include node first and then can connect it to express and socket
//this is node's module
//creating instance of express
const app = express();
const http = require("http").Server(app);
//imported socket and linked with node
const io = require("socket.io")(http);
//importing mongoose database
const mongoose = require("mongoose");
//to hide some sensetive info like passwords
const dotenv = require("dotenv");
//to configure dotenv variable to process's environment variable
dotenv.config();

//url of database and credential
const mongooseURL = process.env.DB_CONNECT;
const mongooseOptions = { useNewUrlParser: true };
//Middleware function to make static files availbale to web server
const filepath = path.join(__dirname, "/public");
app.use(express.static(filepath));
//to parse request object in json format
app.use(bodyParser.json());
//to parse html input values
app.use(bodyParser.urlencoded({ extended: false }));


//setting up handlebars for customized partial html page
app.engine("handlebars",expHandlebars({extname:'.handlebars',layoutsDir:__dirname+'/views/layouts/',defaultLayout:'main'}));
app.set("view engine","handlebars");

//configuring session values
app.use(session({
  cookieName: 'session',//name of session cookie
  secret: process.env.SECRET_KEY,//some secret key to encrypt
  duration: 30 * 60 * 1000,//duration of session expire(30 minute)
  activeDuration: 15 * 60 * 1000,//extend session duration by 15 minutes 
  httpOnly: true,//only http can access cookie not javascript
  secure: true,//works on https only
  ephemeral: true//remove cookie after browser close
}));

//Middleware to pass route to user router on /user
app.use("/", messageRouter);

//Middleware tto pass route to user router on /user
app.use("/user", userRouter);

//handling io on new connection event
io.on("connection", socket => {
  console.log(`user connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} user disconnected!`);
  });
  socket.on("message", data => {
    io.emit("displayMessage", data);
  });
  socket.on("typingMessage", data => {
   socket.broadcast.emit("displayTypingStatus", data);
  });
});

//connecting to database
mongoose.connect(mongooseURL, mongooseOptions, err => {
  if (err) throw err;
  console.log("database connected!..");
});
//needed to listen to http (node server)insted of app.listen because of link of node to socket and express
http.listen(port, () => {
  console.log(`server is running on port :${port}`);
});
