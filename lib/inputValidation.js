//importing joi validator for clien side validatio
const joi = require("@hapi/joi");

//creating validation rule schema
const registerUserValidation = data => {
  const schema = {
    name: joi.string().required(),
    email: joi
      .string()
      .required()
      .email(),
    password: joi.string().required()
  };
  //returning validation
  return joi.validate(data, schema);
};

//login validation
const loginUserValidation = data => {
  const schema = {
    email: joi
      .string()
      .required()
      .email(),
    password: joi.string().required()
  };
  //returning validation
  return joi.validate(data, schema);
};

//chat(message) validation
const chatValidation = data => {
  const schema = {
    sender_id:joi.string().required(),
    receiver_id:joi.string().required(),
    message: joi.string().required()
  };
  //returning validation
  return joi.validate(data, schema);
};

//export module
module.exports.registerUserValidation = registerUserValidation;
module.exports.loginUserValidation = loginUserValidation;
module.exports.chatValidation = chatValidation;
