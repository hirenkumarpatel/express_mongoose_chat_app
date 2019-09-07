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
    
    //function to send message to message-list
    sendButton.on('click',()=>{
       
        addMessage({name:nameInput.val(),message:messageInput.val()});
    });
    let getMessages=()=>{
        fetch("/messages",(data)=>{
            data.forEach(addMessage);
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            console.log(JSON.stringify(data));
        });
    }
});