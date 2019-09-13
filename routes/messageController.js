const app = require("express");
const router = app.Router();
const { newChatValidation } = require("../lib/inputValidation");
// const verifyToken = require("../lib/verifyToken");
const userModel = require("../models/User");
const messageModel = require("../models/Message");
//importing for validtaing string of new messages
const { chatValidation } = require("../lib/inputValidation");
//importing authenticateUser module to authenticate user
const { authenticateUser, requireLogin } = require("../lib/authenticateUser");

//using authenticateUser middleware
router.use(authenticateUser);

router.get("/", requireLogin, (req, res) => {
  messageModel.find({}, (err, data) => {
    res.render("chatapp-chats", { data: data });
  });
});

//post new message
router.post("/", requireLogin, async (req, res) => {
  try {
    console.log(`sessionUsr: ${req.session.user.userId}`);
    //creating json object to validate and post in database  
    const message={
      sender: String(req.session.user.userId),
      message: req.body.message,
      receiver: "somerandomreceiver"
    }
    //check for client level validation
    const { error } = chatValidation(message);
    if (error) return res.status(400).send({ error: error.details[0].message });
    //creating the object of mongoose's Datamodel Message and pass new  value
    let db = new messageModel(message);
    let savedMessage= await db.save();
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send({ error: error });
    console.log(`error ${error}`);
  }
});

//exporting router
module.exports = router;
