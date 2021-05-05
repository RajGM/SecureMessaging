var socket = io.connect('http://localhost:8000');
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


if (sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("authToken") === "undefined") {
    window.location.href = "http://localhost:8000/login";
} else {
    from.value = sessionStorage.getItem("userName");
}

sendButton.onclick = function () {

    var objSent = {
        from: "",
        to: "",
        message: "",
        authToken: "",
        socketID: ""
    }

    objSent.from = from.value;
    objSent.to = to.value;
    objSent.message = message.innerHTML;
    objSent.authToken = sessionStorage.getItem("authToken");
    objSent.socketID = socket.id;

    message.innerHTML = "";
    try {

        socket.emit('chat', {
            from: objSent.from,
            to: objSent.to,
            message: objSent.message,
            authToken: sessionStorage.getItem("authToken"),
            socketID: objSent.socketID
        });
        output.innerHTML += '<p><strong>' + objSent.message + '</strong></p>';
    }
    catch (err) {
        console.log("Error" + err);
    }
}

logoutButton.onclick = function () {
    var objSent = {
        from: "",
        authToken: ""
    }
    objSent.from = localStorage.getItem("userName");
    objSent.authToken = localStorage.getItem("authToken");
    var jsonFormat = JSON.stringify(objSent);
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            var response = JSON.parse(this.responseText);
            console.log(response);
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

async function showData(userData) {
    console.log("User Data", userData);
    console.log("All chatWindow list:" + userData.chatWindows);
    console.log("All chatWindow list Length:" + userData.chatWindows.length);

    for (let i = 0; i < userData.chatWindows.length; i++) {
        let contactDivID = userData.chatWindows[i]+"ContactDiv";
        let chatWindowDisplayDivID = userData.chatWindows[i]+"DisplayBox";
        let toUserName;
        console.log(userData[userData.chatWindows[i]][0].from);
        console.log(userData[userData.chatWindows[i]][0].to);
        if( userData[userData.chatWindows[i]][0].from == sessionStorage.getItem("userName")){
            toUserName = userData[userData.chatWindows[i]][0].to;
        }else{
            toUserName = userData[userData.chatWindows[i]][0].from;
        }
        //first create a div for chatContact
        //convert this into funtion
        let contactDiv = makeContactDiv(toUserName);
        contactDiv.setAttribute("id",contactDivID);
        contactParentDiv.appendChild(contactDiv);
        //test to check it looks better without hr
        // let hr = document.createElement("hr");
        // contactParentDiv.appendChild(hr);
        //test ends here
        
        let chatDiv = makeChatWindowDiv( userData[userData.chatWindows[i]], userData.chatWindows[i] );

        //second create a div for chatDisplayWindow
        //then fill it 
        //  do this until all messages are done
        //      then create a message div
        //      then fill it
        //      then push it
        //then push it 
         
    }
    //         chatWindow.innerHTML += '<div class="chatBox" onclick="hideShow(' + chatCount + ')" id=' + chatCount + '><strong>' + showusr + '</strong></div>';
    //         output.innerHTML += '<div id=' + finalID + '></div>';
    //         let indiChat = document.getElementById(finalID);

    //         let newEle = document.createElement('div');
    //         indiChat.appendChild(newEle);
    //         indiChat.style.display = "none";
    //         for (let j = 0; j < response[i].length; j++) {
    //             for (let [key, value] of Object.entries(response[i][j])) {
    //                 indiChat.innerHTML += key + ":" + value + " ";
    //                 console.log(`${key}:${value}`);
    //             }
    //             indiChat.innerHTML += "<br>";
    //         }

    //         chatCount += 1;
    //     }
    // }

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
    output.innerHTML += '<p><strong>' + data.message + '</strong></p>';
});

function getChatFromServer() {
    let getDatafromServerObject = { socketID: "", authToken: "", userName: "" };
    getDatafromServerObject.socketID = socket.id;
    getDatafromServerObject.userName = sessionStorage.getItem("userName");
    getDatafromServerObject.authToken = sessionStorage.getItem("authToken");
    console.log("Before sending DATA", getDatafromServerObject);
    let jsonData = JSON.stringify(getDatafromServerObject);
    axios.get('http://localhost:8000/chatbox/data', {
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

function makeContactDiv(userName){

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
    moreImgEle.src="/assets/more.png";
    moreItemDiv.appendChild(moreImgEle);
    mainDiv.appendChild(imgDiv);
    mainDiv.appendChild(userNameDiv);
    mainDiv.appendChild(isTypingDiv);
    mainDiv.appendChild(moreItemDiv);

    return mainDiv;
}

function makeChatWindowDiv(chatData,chatDataWindowID){

    console.log("CHAT DATA BEFORE RENDERING");
    console.log("Chat Data",chatData);
    console.log("Chat Data Window ID",chatDataWindowID);
    
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("chatWindowClass");
    mainDiv.setAttribute("id",chatDataWindowID);

    console.log("chatData.length:"+chatData.length);
    for(let i=0;i<chatData.length;i++){
        
    }

    //loop to add whole chat
    let fullWidthDiv = document.createElement("div");
    fullWidthDiv.classList.add("fullWidth");
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("indiMessageDiv");
    //according to conditions left || middle || right

}