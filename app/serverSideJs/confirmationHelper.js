const configFile = require('./../../myUrl');

async function updateEmailVerificationStatus(email) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection('userprofiles');
        dataArr = await db.updateOne({ email: email }, { $set: { isEmailVerified:true } }, { upsert: true, useFindAndModify: false });

    } catch (err) {
        console.log("authToken updation error:" + err);
    } finally {
        client.close();
    }

    return "ABCDEFGH";
}

exports.updateEmailVerificationStatus = updateEmailVerificationStatus;