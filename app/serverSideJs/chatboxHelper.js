exports.module = async function createCollections(name) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;

    const client = await MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true } )
        .catch(err=>console.log(err));

    try{
        const db = client.db('testdb');
        let returnData = await db.createCollection(name)
        .catch(err=>console.log(err));
        if(returnData){
            console.log("Collection created:",returnData);
        }else{
            console.log("Some went wrong");
        }
    }
    catch(err){
        console.log(err);
    }finally{
        client.close();
    }
        if (err) throw err;
        var dbo = db.db("testdb");
        dbo.createCollection(name, function (err, res) {
            if (err) throw err;
            console.log("Collection created! " + name);
            db.close();
        });
    
}

function insertData(name, data) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');

    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testdb");
        //var myobj = { name: "Company Inc", address: "Highway 37" };
        dbo.collection(name).insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

function updateProfile(userName,chatboxName){
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');

    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testdb");
        
        /*
       dbo.collection("userprofiles").findOneAndUpdate(
           {userName:userName},
           {$push:{
            "chatWindow":chatboxName
            }}
           )
           .then(succ=>console.log(succ))
            .catch(err=>console.log(err));
            */
           dbo.collection("userprofiles").updateOne(
            {userName:userName},
               {$push:{
                "chatWindow":chatboxName
            }}
        )
        .then(ok=>console.log("Update chatWindow in profile done:"+ok))
        .catch(err=>console.log("Update cannot be completed:"+err))


    });

}
