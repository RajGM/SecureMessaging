async function connectionToDB() {
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    
    return client;
}

async function chatWindowName(data){
    var usr1;
    var usr2;
    var usr1and2;
    if (data.to > data.from) {
        usr1 = data.from;
        usr2 = data.to;
    } else {
        usr1 = data.to;
        usr2 = data.from;
    }
    usr1and2 = usr1 + usr2;
    return usr1and2;
}

exports.connectionToDB = connectionToDB;
exports.chatWindowName = chatWindowName;
