var socket = io.connect('https://chatapp2capstone.herokuapp.com/');
var from = document.getElementById("fromUser");
var to = document.getElementById("toUser");
var message = document.getElementById("messageUser");
var sendButton = document.getElementById("sendButton");
var output = document.getElementById("output");
var chatWindow = document.getElementById("chatWindow");
var messageBlock = document.getElementById("messageUser");
var logoutButton = document.getElementById('logoutButton');
var contactParentDiv = document.getElementById("contactParentDiv");

var currentChatOpenIndex = 0;
var chatWindowandDisplayBoxTracker = {};
var lastDisplayedChatWindow = "dummyChatWindow";

if (sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("authToken") === "undefined") {
    window.location.href = "/login";
} else {
    from.value = sessionStorage.getItem("userName");
    toUser.value = sessionStorage.getItem("userName");
}

sendButton.onclick = function () {

    var objSent = {
        from: "",
        to: "",
        message: "",
        authToken: "",
        socketID: "",
        chatWindow:""
    }

    objSent.from = from.value;
    objSent.to = to.value;
    objSent.message = message.innerHTML;
    objSent.authToken = sessionStorage.getItem("authToken");
    objSent.socketID = socket.id;

    var selfData = {
        from:from.value,
        to:to.value,
        message:message.innerHTML,
        chatWindow:lastDisplayedChatWindow
    }

    message.innerHTML = "";
    
        socket.emit('chat', {
            from: objSent.from,
            to: objSent.to,
            message: objSent.message,
            authToken: sessionStorage.getItem("authToken"),
            socketID: objSent.socketID
        });

        selfDisplay(selfData);
    
}

logoutButton.onclick = function () {
    var objSent = {
        from: "",
        authToken: ""
    }
    objSent.from = sessionStorage.getItem("userName");
    objSent.authToken = sessionStorage.getItem("authToken");
    var jsonFormat = JSON.stringify(objSent);
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            var response = JSON.parse(this.responseText);
            console.log(response);
            if(response == "logout success"){
                sessionStorage.clear();
                window.location.href = "http://localhost:8000/login";
            }
        }
        xhttp.open("POST", "/chatbox/logout", true);
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xhttp.send(jsonFormat);
    } catch (err) {
        console.log(err);
    }
}

function hideShow(chatIndex) {
    console.log("chatIndex Passed:" + chatIndex);
    console.log("Global open Index:" + currentChatOpenIndex);
    let finalID = "chatCount" + currentChatOpenIndex;
    let modiDom = document.getElementById(finalID);
    modiDom.style.display = "none";
    currentChatOpenIndex = chatIndex;
    finalID = "chatCount" + chatIndex;
    modiDom = document.getElementById(finalID);
    modiDom.style.display = "inline-block";
}

function showData(userData) {

    for (let i = 0; i < userData.chatWindows.length; i++) {
        let contactDivID = userData.chatWindows[i] + "ContactDiv";
        let chatWindowDisplayDivID = userData.chatWindows[i] + "DisplayBox";
        let toUserName;
        console.log(userData[userData.chatWindows[i]][0].from);
        console.log(userData[userData.chatWindows[i]][0].to);
        if (userData[userData.chatWindows[i]][0].from == sessionStorage.getItem("userName")) {
            toUserName = userData[userData.chatWindows[i]][0].to;
        } else {
            toUserName = userData[userData.chatWindows[i]][0].from;
        }

        let contactDiv = makeContactDiv(toUserName);
        contactDiv.setAttribute("id", contactDivID);
        contactDiv.addEventListener("click", showClickedChatDiv, false);
        contactParentDiv.appendChild(contactDiv);


        let chatDiv = makeChatWindowDiv(userData[userData.chatWindows[i]], chatWindowDisplayDivID);
        chatParentDiv.insertBefore(chatDiv, chatParentDiv.children[1]);
        chatDiv.style.display = "none";

        chatWindowandDisplayBoxTracker[contactDivID] = {
            windowName: chatWindowDisplayDivID,
            isDisplayed: false,
            currentIndex: i
        }

    }

}

messageBlock.addEventListener('keypress', function () {
    socket.emit('typing', from.value);
});

socket.on('connect', async function () {
    console.log("SocketID:" + socket.id);
    console.log("userName:" + sessionStorage.getItem("userName"));
    console.log("authTOKEN:" + sessionStorage.getItem("authToken"));

    socket.emit('socketIDUpdate', {
        from: from.value,
        authToken: sessionStorage.getItem("authToken"),
        socketID: socket.id
    });

    getChatFromServer();

});

socket.on('typing', function (data) {
    console.log("Typing a message");
});

socket.on('chat', function (data) {
    console.log(data);
    individualMessagetoChatDiv(data);
});

function getChatFromServer() {
    let getDatafromServerObject = { socketID: "", authToken: "", userName: "" };
    getDatafromServerObject.socketID = socket.id;
    getDatafromServerObject.userName = sessionStorage.getItem("userName");
    getDatafromServerObject.authToken = sessionStorage.getItem("authToken");
    console.log("Before sending DATA", getDatafromServerObject);
    let jsonData = JSON.stringify(getDatafromServerObject);
    axios.get('https://chatapp2capstone.herokuapp.com/chatbox/data', {
        params: {
            authToken: sessionStorage.getItem("authToken"),
            socketID: socket.id,
            userName: sessionStorage.getItem("userName")
        }
    })
        .then(function (response) {
            showData(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function makeContactDiv(userName) {

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("singleContactTest");
    let imgDiv = document.createElement("div");
    let imgEle = document.createElement("img");
    imgEle.src = "/assets/student.png";
    imgEle.classList.add("displayImageTag");
    imgDiv.appendChild(imgEle);
    let userNameDiv = document.createElement("div");
    userNameDiv.innerHTML = userName;
    userNameDiv.classList.add("verticalFlexParent");
    let isTypingDiv = document.createElement("div");
    isTypingDiv.classList.add("verticalFlexParent");
    isTypingDiv.innerHTML = "Typing";
    let moreItemDiv = document.createElement("div");
    moreItemDiv.classList.add("verticalFlexParent");
    let moreImgEle = document.createElement("img");
    moreImgEle.classList.add("moreImageTag");
    moreImgEle.src = "/assets/more.png";
    moreItemDiv.appendChild(moreImgEle);
    mainDiv.appendChild(imgDiv);
    mainDiv.appendChild(userNameDiv);
    mainDiv.appendChild(isTypingDiv);
    mainDiv.appendChild(moreItemDiv);

    return mainDiv;
}

function makeChatWindowDiv(chatData, chatDataWindowID) {

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("chatWindowClass");
    mainDiv.setAttribute("id", chatDataWindowID);

    for (let i = 0; i < chatData.length; i++) {
        let fullWidthDiv = document.createElement("div");
        fullWidthDiv.classList.add("fullWidth");
        let msgDiv = document.createElement("div");
        msgDiv.classList.add("indiMessageDiv");
        msgDiv.innerHTML = chatData[i].message;
        if (sessionStorage.getItem("userName") == chatData[i].from) {
            msgDiv.classList.add("right");
        } else {
            msgDiv.classList.add("left");
        }
        fullWidthDiv.appendChild(msgDiv);
        mainDiv.appendChild(fullWidthDiv);
    }

    return mainDiv;
}

function showClickedChatDiv(event) {
    document.getElementById(lastDisplayedChatWindow).style.display = "none";
    chatWindowandDisplayBoxTracker[event.target.id].isDisplayed = true;
    let toShowWindow = chatWindowandDisplayBoxTracker[event.target.id].windowName;
    document.getElementById(toShowWindow).style.display = "flex";
    lastDisplayedChatWindow = toShowWindow;
    let toSendID = toShowWindow.replace("DisplayBox", "");
    toSendID = toSendID.replace(from.value, "");
    toUser.value = toSendID;    
}

function individualMessagetoChatDiv(data) {
    let fullWidthDiv = document.createElement("div");
    fullWidthDiv.classList.add("fullWidth");
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("indiMessageDiv");
    msgDiv.innerHTML = data.message;
    if (sessionStorage.getItem("userName") == data.from) {
        msgDiv.classList.add("right");
    } else {
        msgDiv.classList.add("left");
    }
    fullWidthDiv.appendChild(msgDiv);
    let chatWindowID = data.chatWindow+"DisplayBox";
    console.log("chatWindowID:"+chatWindowID);
    document.getElementById(chatWindowID).appendChild(fullWidthDiv);
}

function selfDisplay(data){
    let fullWidthDiv = document.createElement("div");
    fullWidthDiv.classList.add("fullWidth");
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("indiMessageDiv");
    msgDiv.innerHTML = data.message;
    if (sessionStorage.getItem("userName") == data.from) {
        msgDiv.classList.add("right");
    } else {
        msgDiv.classList.add("left");
    }
    fullWidthDiv.appendChild(msgDiv);
    let chatWindowID = data.chatWindow;
    document.getElementById(chatWindowID).appendChild(fullWidthDiv);
}