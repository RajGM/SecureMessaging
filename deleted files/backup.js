//chatbox.js serverSide
// @type    POST
//@route    /chatbox
// @desc    for posting data 
// @access  PRIVATE
router.post('/', async (req, res) => {
    const msgValues = { from: "", to: "", message: "" };
    var timeStamp = new Date();

    if (req.body.from != "" && req.body.to != "" && req.body.message != "") {
        msgValues.from = req.body.from;
        msgValues.to = req.body.to;
        msgValues.message = req.body.message;
        msgValues.timeStamp = timeStamp;
    }
    
    const newMessage = new msgSent({
        from: req.body.from,
        to: req.body.to,
        message: req.body.message,
        timeStamp: timeStamp
    });

    let fromProfile = await helperFun2.findProfile(newMessage.from);
    let toProfile = await helperFun2.findProfile(newMessage.to);
    if (toProfile == "exists" && fromProfile == "exists") {
        var usr1;
        var usr2;
        var usr1and2;
        if (req.body.to > req.body.from) {
            usr1 = req.body.from;
            usr2 = req.body.to;
        } else {
            usr1 = req.body.to;
            usr2 = req.body.from;
        }
        usr1and2 = usr1 + usr2;

        let chatboxState = await helperFun.chatWinowFinder(usr1and2);

        if (chatboxState == "exists") {
            helperFun.socketIDUpdate(newMessage.from, req.body.socketID);
            helperFun.insertData(usr1and2, newMessage);
            res.status(200).json({ pro: "Chatwindow exists" });
        } else {
            let chatW = new chatWindow({
                user1: usr1,
                user2: usr2,
                usr12: usr1and2
            });
            let profileUpdateStateFrom = await helperFun.updateProfile(newMessage.from, usr1and2);
            let profileUpdateStateTo = await helperFun.updateProfile(newMessage.to, usr1and2);
            let collectionCreationState = await helperFun.createCollections(usr1and2);
            let chatWindowCollUpdateState = await helperFun.chatWindowCollectionUpdate(chatW);
            let dataInsertState = await helperFun.insertData(usr1and2, newMessage);
            res.status(200).json({ pro: "Chatwindow does not exists created new collection" });
        }

    } else {
        res.status(200).json({ pro: "Reciever profile does not exists" });
    }

});


//index.js

//testing purposes
const dumpDB = require('./app/router/dump');
app.use('/dump', dumpDB);
//testing purposes ends here
