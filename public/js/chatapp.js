//Chatapp App variable intialization with Jquery
$(() => {
  /**login and registration initialization */

  const userName = $(`#user-name`);
  const userNameLabel = $(`#name-label`);
  const userEmail = $(`#user-email`);
  const userPassword = $(`#user-password`);
  const loginButton = $(`#login-button`);
  const ORLabel = $(`#or-label`);
  const registerButton = $(`#register-button`);
  const createAccountButton = $(`#create-account-button`);

  /**chatapp-chats screeen initilization */
  const chatInputbox = $(`#chat-input-box`);
  const chatSendButton = $(`#chat-send-button`);
  const chatHistory = $(`#chat-history`);
  const chatReceiver=$(`#chat-receiver`);

  /** chat user screen initialization*/
  
  //get the user List Item Id to open chat accordingly
  let openUserChats = () => {
    let userId;
    //fetch the Id of user to be clicked and send to chat screen
     $(document).delegate("#user-list>a", "click", e => {
      //assigning UserId with User List Items ID
      userId=e.target.id;
      //redirect to user's chat screen
      window.location.replace(`http://localhost:3000/chatapp/${userId}`);
    });
  };
  openUserChats();

  //initial setup values for login page
  userName.hide();
  userNameLabel.hide();
  registerButton.hide();

  //initiate register form
  let convertToRegisterForm = () => {
    createAccountButton.on("click", () => {
      userNameLabel.show();
      userName.show();
      registerButton.show();
      loginButton.hide();
      ORLabel.hide();
      createAccountButton.hide();
    });
  };

  convertToRegisterForm();

  //registerButton's onclick event handler
  registerButton.on("click", () => {
    let user = {
      name: userName.val(),
      email: userEmail.val(),
      password: userPassword.val(),
      avatar: ""
    };
    registerUser(user);
  });

  //registerUser to register new user in Chatapp database
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
          console.log(JSON.stringify(data.message));
          //to redirect to chatapp application
        } else {
          console.log(`registration failed!!`);
        }
      });
  };

  //Login Button OnClick event handler
  loginButton.on("click", () => {
    let data = {
      email: userEmail.val(),
      password: userPassword.val()
    };
    //triggering loginUser() method
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
          window.location.replace("http://localhost:3000/user");
        } else {
          console.log(`login failed!!`);
        }
      });
  };

  //getAll Message will trigger get method on server to fetch all messages from database
  let getAllMessages = () => {
    fetch("/")
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          console.log("data received clientside");
        } else {
          console.log(`Error:${data.error}`);
        }
      })
      .catch(err => {
        console.log(`Error:${err}`);
      });
  };
  getAllMessages();

  //send button's onClick() event handler
  chatSendButton.on("click", () => {
    var data = { message: chatInputbox.val(),receiver:chatReceiver.val() };
    //triggering new chat post method to save new post
    postNewMessage(data);
  });
  //   socket.on("displayMessage", data => {
  //     addMessage(data);
  //   });
  //postNewChat() to save new chat in database
  let postNewMessage = data => {
    fetch("/", {
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
          //   socket.emit("message", data);
          updateMessageHistory(data);
          clearForm();
        }
      });
  };

  //update Message history after posting new chat
  let updateMessageHistory = data => {
    console.log(JSON.stringify(data));
    chatHistory.append(`<a class="user-list-item" id={{this._id}}>
    <img src="../images/avatar1.PNG" alt="Avatar" class="avatar" />
    <div class="user-item-text">
      <h3 class="user-title">{{this.name}}</h3>
      <p>sample message</p>
      <span class="chat-time">11:00 AM </span>
    </div>
    <div class="user-right-angle">
      <i class="fas fa-angle-right"></i>
    </div>
  </a>`);
  };

  /** clears out form after sending it to server */
  let clearForm = () => {
    chatInputbox.val("");
  };

  //************************end of document.ready()**************************
});
