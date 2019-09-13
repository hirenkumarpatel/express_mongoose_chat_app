//created instnce of io()that will be passed to check new connection
var socket = io();
$(() => {
  //variable initialization
  const messageList = $(`#message-list`);
  const registerButton = $(`#register-button`);
  const userName = $(`#user-name`);
  const userEmail = $(`#user-email`);
  const userPassword = $(`#user-password`);
  const loginButton = $(`#login-button`);
  const loginEmail = $(`#login-email-input`);
  const loginPassword = $(`#login-password-input`);
  const chatSection = $(`#chat-section`);
  const loginSection = $(`#login-section`);
  const sendButton = $(`#chat-send-button`);
  const nameInput = $(`#name-input`);
  const messageInput = $(`#chatinput-box`);
  const typingLabel = $(`#typing-label`);
  let authToken;
  if (authToken) {
    chatSection.show();
    loginSection.hide();
  } else {
    //make chat disable till login finish
    chatSection.hide();
    loginSection.show();
  }

  //register new user
  registerButton.on("click", () => {
    var data = {
      name: userName.val(),
      email: userEmail.val(),
      password: userPassword.val()
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
          console.log(JSON.stringify(data));
          //to redirect to chatapp application
          //window.location.replace("http://localhost:3000/chatapp/");
        } else {
          console.log(`registration failed!!`);
        }
      });
  };

  //login new user
  loginButton.on("click", () => {
    var data = {
      email: userEmail.val(),
      password: userPassword.val()
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
         console.log(JSON.stringify(data.message));
         //to redirect to chatapp application
         window.location.replace("http://localhost:3000/chatapp/");
        } else {
          console.log(`login failed error:${data.error}`);
        }
      });
  };

  // emitting typing.. status to receivevr working dont change
  let updateTypingstatus = () => {
    var typing;
    messageInput.on("input propertychange paste", () => {
      if (messageInput.val().length > 0) {
        typing = true;
        socket.emit("typingMessage", "typing..");
      }else{
        socket.emit("typingMessage", " ");
      }
    });
   
  };
  updateTypingstatus();
  socket.on("displayTypingStatus", data => {
    displayTypingStatus(data);
  });
  displayTypingStatus = data => {
    console.log(`typing message called`);
    typingLabel.text(data);
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
    messageList.append(`<p>${data.message}</p>`);
  };

  //function to send message to message-list
  sendButton.on("click", () => {
    var data = { message: messageInput.val() };

    postMessages(data);
  });
  socket.on("displayMessage", data => {
    addMessage(data);
  });
  let postMessages = (data, authToken) => {
    fetch("/chatapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          socket.emit("message", data);
        }
      })
      .catch(error => {
        console.log("Error in post method:" + error);
      });
  };
  //end of document.ready..
});
