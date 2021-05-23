async function connectionToDB() {
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    
    return client;
}

exports.connectionToDB = connectionToDB;