var userName = document.getElementById("userName");
var Password = document.getElementById("Password");
var email = document.getElementById("email");
var RegisterButton = document.getElementById("RegisterButton");
var loginPageRedirectButton = document.getElementById("loginPageRedirectButton");

RegisterButton.onclick = function () {
    console.log(userName.value);
    console.log(Password.value);
    console.log(email.value);

    var objSent = {
        userName:"",
        Password:"",
        email:""
    }

    objSent.userName = userName.value;
    objSent.Password = Password.value;
    objSent.email = email.value;

    var jsonFormat = JSON.stringify(objSent); 

    try{
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var response = JSON.parse(this.responseText);
        console.log(response);
        if(response=="Fail"){
            console.log("Username exists");
        }else if(response=="Success"){
            console.log("Registration success");
            window.location.href = "http://localhost:8000/login";
        }
    }
    xhttp.open("POST", "/register/", true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send(jsonFormat);    
    }
    catch(err){
        console.log("Error"+err);
    }
}

loginPageRedirectButton.onclick = function(){
    window.location.href = "http://localhost:8000/login";
}