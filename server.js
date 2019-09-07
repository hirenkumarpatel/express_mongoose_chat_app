//importing express
const express=require("express");
//importing body-parser to parse object in json data
const bodyParser=require("body-parser"); 
//creating instance of express
const app=express();
//importing path to access file directories and its path functions
const path=require("path");
const port=process.env.PORT ||3000;
//Middleware function to make static files availbale to web server
app.use(express.static(path.join(__dirname,'/public')));
//defining message json value as if we are importing from database
let messages=[
    {name:"Hiren",message:"Hii"},
    {name:"Jane",message:"Hello"},
    {name:"Hiren",message:"How are you?"}
];

//default layout
app.get("/",(req,res)=>{
    res.send(path.join(__dirname,'/public','/index.html'));
});

//messages json file
app.get("/messages",(req,res)=>{
    res.send(messages);
});
//post new message
app.post("/messages",(req,res)=>{
    messages.push(req.body);
    res.status(200);
});
app.listen(port,()=>{
    console.log(`server is running on port :${port}`);
});
