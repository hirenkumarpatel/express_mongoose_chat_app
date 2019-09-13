//defining model for mongoose schema
const mongoose=require("mongoose");
const Message = mongoose.model("Message", {
    sender: String,
    receiver: String,
    message: String,
    date: {
      type: Date,
      default: Date.now
    },
    status:{
      type:String,default:"sent"
    }
  });
  module.exports= Message;