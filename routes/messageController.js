const app = require("express");
const router = app.Router();
const { newChatValidation } = require("../lib/inputValidation");
const verifyToken = require("../lib/verifyToken");
const userModel = require("../models/User");
const messageModel = require("../models/Message");
//importing for validtaing string of new messages
const { chatValidation } = require("../lib/inputValidation");

const currentUser={};
//messages json file(/message)
router.get("/", verifyToken, (req, res) => {
  
  messageModel.find({}, (err, message) => {
    res.json(message);
  });
});

//post new message
router.post("/", verifyToken, async (req, res) => {
  try {
    //check for client level validation
    //const { error } = chatValidation(req.body);
    //if (error) return res.status(400).send({ error: error.details[0].message });
    //creating the object of mongoose's Datamodel Message and pass new  value
    let message = new messageModel(req.body);
    let savedMessage = await message.save();
    res.status(200);
    res.json(req.body);
  } catch (error) {
    res.status(500).send({ error: error });
    console.log(`error ${error}`);
  }
});

//exporting router
module.exports = router;
