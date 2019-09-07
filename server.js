//importing express
const express = require("express");
//importing body-parser to parse object in json data
const bodyParser = require("body-parser");
//creating instance of express
const app = express();
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
//url of database and credential
const mongooseURL =
  "mongodb+srv://hirenpatel:hirenpatel@chatapp-gssy1.mongodb.net/test?retryWrites=true&w=majority";
const mongooseOptions = { useNewUrlParser: true };
// to include promise library to avoid nested callback hell
mongoose.Promise = Promise;
//Middleware function to make static files availbale to web server
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//defining model for mongoose schema
const Message = mongoose.model("Message", {
  name: String,
  message: String,
  date: {
    type: Date,
    default: Date.now
  }
});
//defining message json value as if we are importing from database
let messages = [
  { name: "Hiren", message: "Hii" },
  { name: "Jane", message: "Hello" },
  { name: "Hiren", message: "How are you?" }
];

//default layout
app.get("/", (req, res) => {
  res.send(path.join(__dirname, "/public", "/index.html"));
});

//messages json file
app.get("/messages", (req, res) => {
  Message.find({}, (err, message) => {
    res.json(message);
  });
});
//post new message
app.post("/messages", async (req, res) => {
  try {
    //creating the object of mongoose's Datamodel Message and pass new  value
    let message = new Message(req.body);
    let savedMessage = await message.save();
    let censored = await Message.findOne({ message: "badword" });
    if (censored) await Message.deleteOne({ _id: censored.id });
    //triggring custom event handling to notify all connected user about new message notification
    else io.emit("message", req.body);
    res.sendStatus(200);
    res.json(JSON.stringify(req.body));
  } catch (error) {
     res.sendStatus(500);
     console.log(`error ${error}`)
  }
});

//handling io on new connection event
io.on("connection", socket => {
  console.log("new user connected!!");
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
