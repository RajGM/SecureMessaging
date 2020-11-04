const express = require('express');
//var database = require('./database');
//var mongo = require('mongodb');
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const finalHelper = require('./app/serverSideJs/indexHelper');

// Define our application
const app = express();

//sockets for real time 
//var http = require('http').Server(app);
//const client = require('socket.io')(http);
var socket = require('socket.io');

// Set 'port' value to either an environment value PORT or 3000
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

//Middleware for bodyparser
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());

//mongodb connect
const configFile = require('./myUrl.js');
const db = configFile.mongoURL+configFile.userName+":"+configFile.password+configFile.restUrl;

mongoose
  .connect(db)
  .then(()=>console.log("Connected Successfully"))
  .catch(err=>console.log(err));

// Router listens on / (root)
var route = require('./router');
app.use('/', route);
const register = require('./app/router/register');
app.use("/register",register);
const login = require('./app/router/login');
app.use("/login",login);
/*
const reset = require('./app/router/reset');
app.use('/reset',reset);
*/
const chatbox = require('./app/router/chatbox');
app.use('/chatbox',chatbox);
const dumpDB = require('./app/router/dump');
app.use('/dump',dumpDB);

const cssFiles = require('./app/router/cssFiles');
app.use('/public',cssFiles);

/*
client.on('connection', () =>{
  console.log('a user is connected')
})
*/

var server = app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
    console.log("You application is running. You should be able to connect to it on http://localhost:" + app.get('port') );
});

var io = socket(server);

io.on('connection',function(socket){
  console.log('Socket made connection with client id:'+socket.id);

  socket.on('chat',async function(data){
    console.log("Socket chat data");
    console.log("Socket:",data);
    io.sockets.emit('chat',data);
    let toSocketID = finalHelper.findSocketID(data.to,data.socketID);
    
    //if sockeID to is found
    if(toSocketID !=""){
      let fi = await finalHelper.insertChatData(data);
      console.log("Final console log:",fi);
     // io.sockets.emit('chat',data); //to particular user
    }
    else{
      //if sockeID to is not found
      console.log("Something went wrong");
    }
    
  });

  socket.on('socketIDUpdate',async function(data){
    console.log("Updation data:",data);
    console.log("SocketID in on.socket:"+data.socketID)
    //update socket id from here
    let upSid = await finalHelper.updateSocketID(data.from,data.authToken,data.socketID);
    console.log("SocketID update:"+upSid);
  });

  socket.on('typing',function(data){
      console.log("Typing");
    socket.broadcast.emit('typing',data);
  });
});