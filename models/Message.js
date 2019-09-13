//defining model for mongoose schema
const mongoose=require("mongoose");
const Message = mongoose.model("Message", {
    sender: String,
    receiver: String,
    message: String,
    date: {
      type: Date,
      default: Date.now
    }
  });
  module.exports= Message;