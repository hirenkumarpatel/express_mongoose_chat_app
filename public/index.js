//created instnce of io()that will be passed to check new connection
var socket = io();
$(() => {
  //variable initialization
  // const messageList=$(`#message-list`);
  const registerButton = $(`#register-button`);
  const registerName = $(`#register-name-input`);
  const registerEmail = $(`#register-email-input`);
  const registerPassword = $(`#register-password-input`);
  const loginButton = $(`#login-button`);
  const loginEmail = $(`#login-email-input`);
  const loginPassword = $(`#login-password-input`);
  const chatSection=$(`#chat-section`);
  const loginSection=$(`#login-section`);
  const sendButton = $(`#send-button`);
  const nameInput = $(`#name-input`);
  const messageInput = $(`#message-input`);
  //make chat disable till login finish
  chatSection.hide();
  
  // const nameInput=$(`#name-input`);
  // const messageInput=$(`#message-input`);

  //register new user
  registerButton.on("click", () => {
    var data = {
      name: registerName.val(),
      email: registerEmail.val(),
      password: registerPassword.val()
    };
    registerUser(data);
  });
  //registerUser method will send respose to server to register new user
  let registerUser = data => {
    fetch("/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(data)
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
          if(!data.error){
              console.log("user registred..");
          }
          else{
            console.log("Error"+JSON.stringify(data));
          }
      })
      .catch(err => {
        console.log("Error in new user registration");
      });
  };

  //login new user
  loginButton.on("click", () => {
    var data = {
      email: loginEmail.val(),
      password: loginPassword.val()
    };
    //login user
    loginUser(data);
  });
  //loginUser method will send respose to server to login new user
  let loginUser = data => {
    fetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(data)
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
          if(!data.error){
              console.log("user logged in.."+JSON.stringify(data.token));
              loginSection.hide();
              chatSection.show();
          }
          else{
            console.log("Error"+JSON.stringify(data));
          }
      })
    //   .catch(err => {
    //     console.log("Error in new user login:"+err);
    //   });
  };

  // ***************dont touchh this code now******************
  // add message function to add new message to message list
  let addMessage=(data)=>{
  messageList.append(`<span style="font-size:1.2rem">${data.name}: </span><p>${data.message}</p>`);
  }
  
  //handling triggred event and create new message
  socket.on("message",addMessage);

  //function to send message to message-list
  sendButton.on('click',()=>{
      var data={name:nameInput.val(),message:messageInput.val()}
      postMessages(data);
  });
  let getMessages=()=>{
      fetch("/messages")
      .then((res)=>{
          return res.json();
      }).then((data)=>{
          data.forEach(addMessage);
      });
  }
  //get messages
  getMessages();
  let postMessages=(data)=>{
      fetch("/messages",{
          method:"POST",
          headers:{"Content-Type":"application/json;charset=utf-8"},
          body:JSON.stringify(data)
      })
      .then((res)=>{
          return res.json()
      }).then((data)=>{
          addMessage(data);
      }).catch(err=>{
          console.log("Error in new message post");
      });
  }
});
