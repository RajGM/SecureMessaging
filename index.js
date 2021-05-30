//import env
require('dotenv').config();

//importing libraries
const express = require('express');
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

//importing custom build helper funtions
const indexHelper = require('./app/serverSideJs/indexHelper');
const allHelper = require('./app/serverSideJs/allHelper');
const chatBoxHelper = require('./app/serverSideJs/chatboxHelper');
const registerHelper = require('./app/serverSideJs/registerHelper');
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
const db = `${process.env.mongoURL}${process.env.mongoUserName}:${process.env.mongoPassword}${process.env.mongoRestUrl}`;

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
    let mongoClient = await allHelper.connectionToDB();
    let finalToken = data.authToken.split(" ")[1];
    //check authtoken update socketID 

    let upSid = await indexHelper.updateSocketID(data.from, finalToken, data.socketID, mongoClient);
    mongoClient.close();
  });

  socket.on('chat', async function (data) {

    let finalToken = data.authToken.split(" ")[1];
    let mongoClient = await allHelper.connectionToDB();
    let authTokenVerified = await chatBoxHelper.verifyAuthToken(data.from, finalToken, mongoClient);
    console.log("authTokenVerified:" + authTokenVerified);
    if(authTokenVerified){
        let toProfileState = await registerHelper.findUserName(data.to,mongoClient);
        if(toProfileState!="notExists"){

          let toSocketID = await indexHelper.findSocketID(data.to, mongoClient);
          if(toSocketID){
            let chatWindowName = allHelper.chatWindowName({ "from": data.from, "to": data.to });
            
            let datatoSend = {
              from: data.from,
              to: data.to,
              message: data.message,
              chatWindow: chatWindowName
            }

            io.sockets.to(toSocketID).emit("chat", datatoSend);
            
          }else{
            console.log("Data saved to DB user is offline");
          }

          indexHelper.insertChatData(data, mongoClient);
    

        }else{
          //touser does not exists somebody is trying to messup the system 
        }
    }else{
      //from user token expired it is either by accident or somebody is trying to mess with the server
    }
    //mongoClient.close();
    //solve mongoClient close issue as well
    

  });

  //do socket on typing events here
  // socket.on('typing', async function (data) {
  //   console.log("Typing");
  // });

});