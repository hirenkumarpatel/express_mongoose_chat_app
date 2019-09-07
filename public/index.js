//created instnce of io()that will be passed to check new connection
var socket=io();
$(()=>{
    
    //variable initialization
    const messageList=$(`#message-list`);
    const sendButton=$(`#sendButton`);
    const nameInput=$(`#name-input`);
    const messageInput=$(`#message-input`);
    
    
    // add message function to add new message to message list
    let addMessage=(data)=>{
    messageList.append(`<h4>${data.name}:</h4><p>${data.message}</p>`);
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