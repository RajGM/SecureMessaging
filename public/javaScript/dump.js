/*
window.onload = function(){
    try{
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
                var response = JSON.parse(this.responseText);
                console.log(this.responseText);
                console.log(response.logInfo);
        };
        xhttp.open("GET", "/dump/", true);
        xhttp.send();    
        }
        catch(err){
            console.log("Error"+err);
        }
}
*/

var dumpButton = document.getElementById("dumpButton");

dumpButton.onclick = function () {
    
    try{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          console.log("Doing Good");
        }
    };

    /*
    xhttp.onload = function(){
            var response = JSON.parse(this.responseText);
            console.log(this.responseText);
            console.log(response.logInfo);
    };
    */
    xhttp.open("GET", "/dump/data", true);
    xhttp.send();    

    }
    catch(err){
        console.log("Error"+err);
    }
    
}

console.log("This will dump all data");


/*
check for 
application/x-www-form-urlencoded
VS
application/json; charset=utf-8
*/