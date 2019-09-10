//importing instance of router from express()
const router = require("express").Router();
//importing user model
const userModel = require("../models/User");
//importing validations to validate user input
const {
  registerUserValidation,
  loginUserValidation
} = require("../lib/inputValidation");
//importing bcrypt and json web token to  hash password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//creating route to register new user
router.post("/register", async (req, res) => {
  //check for client level validation
  const { error } = registerUserValidation(req.body);
  if (error) return res.status(400).send({error:error.details[0].message});
  //check for database level validation
  const emailExists = await userModel.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send({ error: "Email already exists" });

  //if user does not exists already then create password and save the data
  //create security key to hash password
  const salt = await bcrypt.genSalt(10);
  //hash the password and append security key to end
  const hasedPassword = await bcrypt.hash(req.body.password, salt);

  //populate the new user info to userModule to insert in database
  const user = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: hasedPassword
  });
  //save the data in database
  try {
    //save is mongoose method to save data
    const savedUser = await user.save();
    res.send(user.id);
  } catch (error) {
    res.status(400).send({error:error});
  }
});

//Login process
router.post("/login",async (req,res)=>{
    //input level validation
    const {error}=loginUserValidation(req.body);
    if(error) return res.status(400).send({error:error.details[0].message});

    //database level vallidation by checking user and password

    const user=await userModel.findOne({email:req.body.email});
    if(!user) return res.status(400).send({error:'Invalid User !!'});
    else{
        //check for password
        const validPassword=await bcrypt.compare(req.body.password,user.password);
        if(!validPassword) return res.status(400).send({error:'Invalid Password !!'});

       
        //assigning the json web token by pasing some unique information and token secret
        const token=jwt.sign({_id:user._id},process.env.SECRET_KEY);
        //now send token along with header
        res.header({"auth-token":token}).send({token:token});
        
        //res.send("Authentication successful !!");

    }
    
});

//exporting router
module.exports = router;
