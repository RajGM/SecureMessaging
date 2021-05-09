//import env
require('dotenv').config();

//importing libraries
const express = require('express');
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

//importing custom build helper funtions
const indexHelper = require('./app/serverSideJs/indexHelper');

// Define our application
const app = express();

//sockets for real time 
var socket = require('socket.io');

// Set 'port' value to either an environment value PORT or 3000
app.set('port', process.env.PORT || 8000);

//for frontEnd CSS and JS files 
app.use(express.static(__dirname + '/public'));

//Middleware for bodyparser
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());

//mongodb connect
const configFile = require('./myUrl.js');
const dbtest = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
const db = `${process.env.mongoURL}${process.env.mongoUserName}:${process.env.mongoPassword}${process.env.mongoRestUrl}`;
console.log("DB:"+db);
console.log("DT:"+dbtest);

mongoose
  .connect(db)
  .then(() => console.log("Connected Successfully"))
  .catch(err => console.log(err));

// Router listens on / (root)
var route = require('./router');
app.use('/', route);
const register = require('./app/router/register');
app.use("/register", register);
const login = require('./app/router/login');
app.use("/login", login);
const chatbox = require('./app/router/chatbox');
app.use('/chatbox', chatbox);
const confirmation = require('./app/router/confirmation');
app.use('/confirmation', confirmation);

const invalidRoute = require('./app/router/invalidRoute');
app.use('*', invalidRoute);

const cssFiles = require('./app/router/cssFiles');
app.use('/public', cssFiles);

//starting server
var server = app.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
  console.log("You application is running. You should be able to connect to it on http://localhost:" + app.get('port'));
});

//socket connection
var io = socket(server);

io.on('connection', function (socket) {
  console.log('Socket made connection with client id:' + socket.id);

  socket.on('socketIDUpdate', async function (data) {
    let finalToken = data.authToken.split(" ")[1];
    //check authtoken update socketID 
    let upSid = await indexHelper.updateSocketID(data.from, finalToken, data.socketID);
  });

  socket.on('chat', async function (data) {
    let finalToken = data.authToken.split(" ")[1];
    let toSocketID = await indexHelper.findSocketID(data.from, finalToken,data.to);
    let dataInsertState = await indexHelper.insertChatData(data);
    
    console.log("toSocketID"+toSocketID);
    //fix response for each funtion
    if( toSocketID == "incorrect Auth Token" ){
      console.log("Data saved to DB user is offline");
    }else if (toSocketID != "notexists") {
      //if sockeID to is found
      let datatoSend = {
        from: data.from,
        to: data.to,
        message: data.message,
        chatWindow:dataInsertState[1]
      }
      // console.log("DATA THE USER WILL BE RECIEVING"+datatoSend);
      io.sockets.to(toSocketID).emit("chat", datatoSend);
      //make it double tick here
    }
    else{
      //make it single tick here
    }

  });

  // socket.on('typing', async function (data) {
  //   console.log("Typing");
  // });

});