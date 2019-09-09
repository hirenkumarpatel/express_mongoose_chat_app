const jwt= require('jsonwebtoken');

//Middleware to verify access token and authentication exporting this function to be used anywhere we want to make private routes
module.exports= (req,res,next)=>{
    //retriving auth-token from header
    const token=req.header('auth-token');
    if(!token) return res.status(401).send({error:'Access Denied'});
    try {
        //check for token and secret key to verify
        const verified=jwt.verify(token,process.env.SECRET_KEY);
        req.user=verified;
        next();
    } catch (error) {
        res.status(400).send({error:"Invalid Token!!"});
        
    }
}
