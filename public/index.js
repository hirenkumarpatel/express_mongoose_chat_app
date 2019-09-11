//created instnce of io()that will be passed to check new connection
var socket = io();
$(() => {
  //variable initialization
  const messageList = $(`#message-list`);
  const registerButton = $(`#register-button`);
  const registerName = $(`#register-name-input`);
  const registerEmail = $(`#register-email-input`);
  const registerPassword = $(`#register-password-input`);
  const loginButton = $(`#login-button`);
  const loginEmail = $(`#login-email-input`);
  const loginPassword = $(`#login-password-input`);
  const chatSection = $(`#chat-section`);
  const loginSection = $(`#login-section`);
  const sendButton = $(`#send-button`);
  const nameInput = $(`#name-input`);
  const messageInput = $(`#message-input`);
  let authToken;
  if (authToken) {
    chatSection.show();
    loginSection.hide();
  } else {
    //make chat disable till login finish
    chatSection.hide();
    loginSection.show();
  }

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
        if (!data.error) {
          console.log("user registred..");
        } else {
          console.log("Error" + JSON.stringify(data));
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
        if (!data.error) {
          authToken = JSON.stringify(data.token);
          //remove first and last " "'s from string
          authToken = authToken.substring(1, authToken.length - 1);
          console.log("user logged in.." + authToken);
          loginSection.hide();
          chatSection.show();
          getMessages(authToken);
        } else {
          console.log("Error" + JSON.stringify(data));
        }
      });
    //   .catch(err => {
    //     console.log("Error in new user login:"+err);
    //   });
  };

  //get messages
  let getMessages = data => {
    fetch("/messages", {
      headers: { "auth-token": data }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data.length) data.forEach(addMessage);
      });
  };

  // add message function to add new message to message list
  let addMessage = data => {
    messageList.append(
      `<p>${data.message}</p>`
    );
  };
  
  //function to send message to message-list
  sendButton.on("click", () => {
    var data = { message: messageInput.val() };
    
    postMessages(data, authToken);
  });
  socket.on("message",(data)=>{
    addMessage(data);
  });
  let postMessages = (data, authToken) => {
      fetch("/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "auth-token": authToken
        },
        body: JSON.stringify(data)
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if(!data.error){
            socket.emit("message",data);
            console.log("new message posted!!");
          }
          
        })
     .catch (error=>{
      console.log("Error in post method:" + error);
     }) 
  };
  //end of document.ready..
});
