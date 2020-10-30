var dumpData = document.getElementById("dumpData");
var dataDiv = document.getElementById("allData");

let totaldata;

dumpData.onclick = function () {

    try {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                let response = JSON.parse(this.responseText);
                totaldata = response;
                //console.log(typeof response);
                //console.log(response.length)
                console.log("Data coming");
                for (let i = 0; i < response.length; i++) {
                    if (i == 0) {
                        //do nothing
                    } else {
                        let newEle = document.createElement('p');
                        //newEle.appendChild(document.createTextNode(response[0][i-1]));
                        newEle.innerHTML += 'Collection Name:'+response[0][i-1]+'<br>';
                        dataDiv.appendChild(newEle);
                        for (let j = 0; j < response[i].length; j++) {
                            //let txtNode = document.createTextNode(response[i][j]);
                            //dataDiv.appendChild(txtNode);
                            for(let [key,value] of Object.entries(response[i][j])){
                                dataDiv.innerHTML+= key+":"+value+"<br>";
                                console.log(`${key}:${value}`);
                            }
                        }
                    }
                }
            }
        };
        xhttp.open("GET", "/dump/data", true);
        xhttp.send();
    }
    catch (err) {
        console.log("Error" + err);
    }

}

console.log("This will dump all data");

/*
check for
application/x-www-form-urlencoded
VS
application/json; charset=utf-8
*/