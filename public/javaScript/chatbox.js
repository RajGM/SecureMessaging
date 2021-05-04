var socket = io.connect('http://localhost:8000');
var from = document.getElementById("fromUser");
var to = document.getElementById("toUser");
var message = document.getElementById("messageUser");
var sendButton = document.getElementById("sendButton");
var output = document.getElementById("output");
var chatWindow = document.getElementById("chatWindow");
var messageBlock = document.getElementById("messageUser");
var logoutButton = document.getElementById('logoutButton');
var currentChatOpenIndex = 0;

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
    objSent.message = message.value;
    objSent.authToken = sessionStorage.getItem("authToken");
    objSent.socketID = socket.id;

    message.value = "";
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
    console.log("All chatWindow list:"+userData[0]);
        
            let chatCount = 1;
            for (let i = 0; i < userData[0].length; i++) {
                if (i != 0) {
                    let showusr;
                    if (response[i][0].from == sessionStorage.getItem("userName")) {
                        showusr = response[i][0].to;
                    } else {
                        showusr = response[i][0].from;
                    }
                    let finalID = "chatCount" + chatCount;
                    console.log("finalID:" + finalID);
                    chatWindow.innerHTML += '<div class="chatBox" onclick="hideShow(' + chatCount + ')" id=' + chatCount + '><strong>' + showusr + '</strong></div>';
                    output.innerHTML += '<div id=' + finalID + '></div>';
                    let indiChat = document.getElementById(finalID);

                    let newEle = document.createElement('div');
                    indiChat.appendChild(newEle);
                    indiChat.style.display = "none";
                    for (let j = 0; j < response[i].length; j++) {
                        for (let [key, value] of Object.entries(response[i][j])) {
                            indiChat.innerHTML += key + ":" + value + " ";
                            console.log(`${key}:${value}`);
                        }
                        indiChat.innerHTML += "<br>";
                    }

                    chatCount += 1;
                }
            }
        
    

}

messageBlock.addEventListener('keypress', function () {
    socket.emit('typing', from.value);
});

socket.on('connect', async function () {
    console.log("SocketID:" + socket.id);
    console.log("userName:"+sessionStorage.getItem("userName"));
    console.log("authTOKEN:"+sessionStorage.getItem("authToken"));

    socket.emit('socketIDUpdate', {
        from: from.value,
        authToken: sessionStorage.getItem("authToken"),
        socketID: socket.id
    });

    let uN = { socketID: "", authToken: "" ,userName:""};
    uN.socketID = socket.id;
    uN.userName = sessionStorage.getItem("userName");
    uN.authToken = sessionStorage.getItem("authToken");
    console.log("Before sending DATA", uN);
    // let jsonData = JSON.stringify(uN);
    // axios.get('http://localhost:8000/chatbox/data', {
    //     params: {
    //         authToken: sessionStorage.getItem("authToken"),
    //         socketID: socket.id,
    //         userName:sessionStorage.getItem("userName")
    //     }
    // })
    //     .then(function (response) {
    //         showData(response.data);
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

});

socket.on('typing', function (data) {
    
    console.log("Typing a message");
});

socket.on('chat', function (data) {
    console.log(data);
    output.innerHTML += '<p><strong>' + data.message + '</strong></p>';
});
