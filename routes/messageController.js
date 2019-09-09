const router = require("express").Router();
const { newChatValidation } = require("../lib/inputValidation");
const verifyToken = require("../lib/verifyToken");
const messageModel = require("../models/Message");

//messages json file(/message)
router.get("/", verifyToken, (req, res) => {
  messageModel.find({}, (err, message) => {
    res.json(message);
  });
});

//post new message
router.post("/messages",verifyToken, async (req, res) => {
  try {
    //creating the object of mongoose's Datamodel Message and pass new  value
    let message = new Message(req.body);
    let savedMessage = await message.save();
    let censored = await messageModel.findOne({ message: "badword" });
    if (censored) await messageModel.deleteOne({ _id: censored.id });
    //triggring custom event handling to notify all connected user about new message notification
    else io.emit("message", req.body);
    res.sendStatus(200);
    res.json(JSON.stringify(req.body));
  } catch (error) {
     res.sendStatus(500);
     console.log(`error ${error}`)
  }
});

//exporting router
module.exports = router;
