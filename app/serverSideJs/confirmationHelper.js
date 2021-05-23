//update email verification status of user
async function updateEmailVerificationStatus(email,mongoClient) {
    let dataArr;
    
    try {
        const db = mongoClient.db(process.env.mongoDBName).collection('userprofiles');
        dataArr = await db.updateOne({ email: email }, { $set: { isEmailVerified:true } }, { upsert: true, useFindAndModify: false });

    } catch (err) {
        console.log("authToken updation error:" + err);
    } 

    return "ABCDEFGH";
}

//export updateEmailVerificationStatus function
exports.updateEmailVerificationStatus = updateEmailVerificationStatus;