//import user model
const userModel = require("../models/User");

//Middleware to handle check session availaable and if available get the user information
let authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    
    userModel.findOne({ _id: req.session.user }, (err, user) => {
      if (user) {
        req.user = {userId:user._id, userName: user.name,userEmail:user.email };
        req.session.user = req.user; //refresh the session value
        res.locals.user = req.user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
};

//Middleware function to check whether user is logged in or not
let requireLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/user/login");
  } else {
    next();
  }
};
module.exports = { requireLogin, authenticateUser };
