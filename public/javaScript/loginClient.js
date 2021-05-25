var userName = document.getElementById("userName");
var Password = document.getElementById("Password");
var LoginButton = document.getElementById("LoginButton");
sessionStorage.clear();

LoginButton.onclick = function () {
 
  var objSent = {
    userName: "",
    Password: "",
  }

  objSent.userName = userName.value;
  objSent.Password = Password.value;

  var jsonFormat = JSON.stringify(objSent);
  try {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      var response = JSON.parse(this.responseText);
      console.log(this.responseText);
      if (response.logInfo == "Fail") {
        console.log("Incorrect User Name or password");
        //handle fail response here
      } else if (response.logInfo == "Success") {
        sessionStorage.setItem("userName", objSent.userName);
        sessionStorage.setItem("authToken", response.authToken);
        userName.value = "";
        Password.value = "";
        window.location.href = "/chatbox";
      }
    };
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send(jsonFormat);
  }
  catch (err) {
    console.log("Error" + err);
  }

}
