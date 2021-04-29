var userName = document.getElementById("userName");
var Password = document.getElementById("Password");
var LoginButton = document.getElementById("LoginButton");
sessionStorage.clear()

LoginButton.onclick = function () {
    console.log(userName.value);
    console.log(Password.value);

    var objSent = {
        userName:"",
        Password:"",
        }

    objSent.userName = userName.value;
    objSent.Password = Password.value;

    var jsonFormat = JSON.stringify(objSent); 

    try{
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
            var response = JSON.parse(this.responseText);
            console.log(this.responseText);
            console.log(response.logInfo);
            if(response.logInfo=="Fail"){
              console.log("Incorrect User Name or password");
            }else if(response.logInfo=="Success"){
              console.log("Correct Username and password");
              sessionStorage.setItem("userName",response.userName);
              sessionStorage.setItem("authToken",response.authToken);
              userName.value="";
              Password.value="";
              window.location.href = "http://localhost:8000/chatbox";
            }
    };
    xhttp.open("POST", "/login/", true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send(jsonFormat);    
    }
    catch(err){
        console.log("Error"+err);
    }
    
}

/*
check for 
application/x-www-form-urlencoded
VS
application/json; charset=utf-8
*/