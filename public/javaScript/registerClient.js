var userName = document.getElementById("userName");
var Password = document.getElementById("Password");
var email = document.getElementById("email");
var RegisterButton = document.getElementById("RegisterButton");

RegisterButton.onclick = function () {

    let inputSecurityStatus = inputSanitization(userName.value, Password.value, email.value);

    if (inputSecurityStatus.lengthState == true && inputSecurityStatus.typeState == true) {
        
        var objSent = {
            userName: "",
            Password: "",
            email: ""
        }
    
        objSent.userName = userName.value;
        objSent.Password = Password.value;
        objSent.email = email.value;

        doRegistration(objSent);

    } else if (inputSecurityStatus.lengthState == false && inputSecurityStatus.typeState == true) {
        console.log("Not Good length String");
        console.log(inputSecurityStatus.lengthStateError);
        if (inputSecurityStatus.lengthStateError.userNameLength == false) {

        }

        if (inputSecurityStatus.lengthStateError.passwordLength == false) {

        }

        if (inputSecurityStatus.lengthStateError.emailLength == false) {

        }

    } else {
        console.log("Someone is messing with the system");
        //do something here
        //show no warning
    }

}

function inputSanitization(userName, password, email) {
    let inputLengthTest = checkLengthOfInput(userName, password, email);
    let inputTypeTest = checkTypeofInput(userName, password, email);
    let lengthState = (inputLengthTest.userNameLength == true && inputLengthTest.passwordLength == true && inputLengthTest.emailLength == true);
    let typeState = (inputTypeTest.userNameType == true && inputTypeTest.passwordType == true && inputTypeTest.emailType == true);

    //do embedded script test also 

    if (lengthState && typeState) {
        return { "lengthState": lengthState, "typeState": typeState };
    } else if (!typeState) {
        //do intrusion alert from here
        return { "lengthState": lengthState, "typeState": typeState };
    } else if (!lengthState && typeState) {
        return { "lengthState": lengthState, lengthStateError: inputLengthTest, "typeState": typeState };
    } else if (!lengthState && !typeState) {
        //do intrusion alert from here as well
        return { "lengthState": lengthState, "typeState": typeState };
    }

}

function checkLengthOfInput(userName, password, email) {

    let userNameState;
    let passwordState;
    let emailState;

    if (userName.length != 0 && userName.length <= 12) {
        userNameState = true;
    } else {
        userNameState = false;
    }

    if (password.length >= 8 && password.length <= 50) {
        passwordState = true;
    } else {
        passwordState = false;
    }

    if (email.length != 0 && email.length <= 30) {
        emailState = true;
    } else {
        emailState = false;
    }

    return { userNameLength: userNameState, passwordLength: passwordState, emailLength: emailState };
}

function checkTypeofInput(userName, password, email) {
    let userNameState = typeof (userName) == "string";
    let passwordState = typeof (password) == "string";
    let emailState = typeof (email) == "string";

    return { userNameType: userNameState, passwordType: passwordState, emailType: emailState };
}

function doRegistration(objSent) {
    var jsonFormat = JSON.stringify(objSent);

    try {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            var response = JSON.parse(this.responseText);
            console.log(response);
            if (response == "Fail") {
                console.log("Username exists");
            } else if (response == "Success") {
                window.location.href = "/login";
            }
        }
        xhttp.open("POST", "/register/", true);
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xhttp.send(jsonFormat);
    }
    catch (err) {
        console.log("Error" + err);
    }
}