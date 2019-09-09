const mongoose=require("mongoose");

//create user schema to define user attribute and types in mongoose database
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        max:50,
        required:true
    },
    email:{
        type:String,
        max:100,
        min:5,
        required:true
    },
    password:{
        type:String,
        max:1024,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

//export userschma which is imported in auth.js
module.exports=mongoose.model('User',userSchema);