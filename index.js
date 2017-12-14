var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var i =0;
var playerIDArray =[];
server.listen(8000,()=>{
  console.log("server running");
});

io.on('connection',function(socket){
  console.log("socket connected");
  playerIDArray.push(socket.id);
  i++;
  socket.emit('socketID',{id: socket.id, playerStart: i})
  if (i==2){
    io.to(playerIDArray[0]).emit('playerConnected',{opponentID: playerIDArray[1]});
    socket.emit('playerConnected',{opponentID: playerIDArray[0]});
    i=0;
    playerIDArray=[];
  }
  socket.on('disconnect',function(){
    console.log("player disconnected");
  })
})
