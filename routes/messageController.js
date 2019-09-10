const app=require("express");
const router =app.Router();
//this is node's module
const http = require("http").Server(app);
//imported socket and linked with node
const io = require("socket.io")(http);

const { newChatValidation } = require("../lib/inputValidation");
const verifyToken = require("../lib/verifyToken");
const messageModel = require("../models/Message");
//const io=require("../server");

//handling io on new connection event
// io.on("connection", socket => {
//   console.log("new user connected:"+socket.id);
//   socket.on("disconnect",()=>{
//     console.log("user disconnected!");
//   });
//   socket.on("message",(data)=>{
//     io.emit("message",data);
//   });
  
// });
//messages json file(/message)
router.get("/",verifyToken, (req, res) => {
  messageModel.find({}, (err, message) => {
    res.json(message);
  });
  
});

//post new message
router.post("/",verifyToken, async (req, res) => {
  try {
    //creating the object of mongoose's Datamodel Message and pass new  value
    let message = new messageModel(req.body);
    let savedMessage = await message.save();
    //io.emit("message", req.body);
    res.status(200);
    res.json(req.body);
    
  } catch (error) {
     res.status(500).send({error:error});
     console.log(`error ${error}`)
  }
});

//exporting router
module.exports = router;
