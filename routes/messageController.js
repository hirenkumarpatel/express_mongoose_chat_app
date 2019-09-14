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
  console.log(req.session.user);
});
//get all chats related to recipient user id
router.get("/chatapp/:user", requireLogin, async (req, res) => {
  let receiverId = req.params.user;
  let receiver;
  let messages = [];
  await messageModel.find(
    {
      $or: [
        {
          $and: [{ receiver: receiverId }, { sender: req.session.user.userId }]
        },
        {
          $and: [{ sender: receiverId }, { receiver: req.session.user.userId }]
        }
      ]
    },
    (err, data) => {
      if (err) return res.status(400).send({ error: err });

      //if more than 1 message found
      if (data.length > 0) {
        //get the receiver name from database
        userModel.findOne({ _id: receiverId }, (err, user) => {
          if (err) return res.status(400).send({ error: err });
          receiver = {
            receiverId: receiverId,
            receiverName: user.name
          };
          //classifying who is sender and receiver in chat history
          data.forEach(message => {
            //if message from logged in user or opponent
            let messageFrom =
              message.sender == receiverId ? "receiver" : "sender";
            let date = new Date(message.date);
            messages.push({
              messageFrom: messageFrom,
              message: message.message,
              date: date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
              }),
              status: message.status
            });
          });

          //redirect to chat screen
          res.render("chatapp-chats", {
            title: "Chats-Chatapp",
            receiver: receiver,
            messages: messages
          });
        }); //end of userModel find query
      }
    }
  ); //end of messageModel query
});

//post new message
router.post("/", requireLogin, async (req, res) => {
  try {
    //creating json object to validate and post in database
    const message = {
      sender: String(req.session.user.userId),
      message: req.body.message,
      receiver: req.body.receiver
    };
    //check for client level validation
    const { error } = chatValidation(message);
    if (error) return res.status(400).send({ error: error.details[0].message });
    //creating the object of mongoose's Datamodel Message and pass new  value
    let db = new messageModel(message);
    let savedMessage = await db.save((err, message) => {
      if (err) return res.status(400).send({ error: err });
      
      //if message from logged in user or opponent
      let messageFrom =
      message.sender == req.session.user.userId ? "sender" : "receiver";
      let date = new Date(message.date);
      let newMessage = {
        messageFrom: messageFrom,
        message: message.message,
        date: date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true
        }),
        status: message.status
      };
      res.status(200).send(newMessage);
    });
  } catch (error) {
    res.status(500).send({ error: error });
    console.log(`error ${error}`);
  }
});

//exporting router
module.exports = router;
