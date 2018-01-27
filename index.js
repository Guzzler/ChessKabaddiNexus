var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var i =0;
var playerIDArray =[];
server.listen(3000,()=>{
  console.log("server running");
});

io.on('connection',function(socket){
  console.log("socket connected");
  playerIDArray.push(socket.id);
  i++;
  socket.emit('socketID',{id: socket.id, playerStart: i})
  if (i%2==0){
    io.to(playerIDArray[i-2]).emit('playerConnected',{opponentID: playerIDArray[i-1]});
    socket.emit('playerConnected',{opponentID: playerIDArray[i-2]});
  }
  socket.on('startGame',(opponentData)=>{
    io.to(opponentData.opponentID).emit('startGam.
    e',{opponentID:socket.id});
  })
  socket.on('gameOver',(pointData)=>{
    io.to(pointData.opponentID).emit('gameOver',{points:pointData.points,opponentID:socket.id});
  })
  socket.on('defenderMove',(defenderData)=>{
    io.to(defenderData.opponentID).emit('defenderMove',defenderData);
  })
  socket.on('attackerMove',(attackerData)=>{
    io.to(attackerData.opponentID).emit('attackerMove',attackerData);
  })
  socket.on('disconnect',function(){
    var j =0;
    if(i%2==1){
      i++;
    }
    else{
      playerIDArray.forEach((playerID)=>{
        if(socket.id == playerID){
          if(j%2==0){
            io.to(playerIDArray[j+1]).emit('opponentDisconnect',{opponentID:socket.id});
          }
          else{
            io.to(playerIDArray[j-1]).emit('opponentDisconnect',{opponentID:socket.id});
          }
        }
        j++;
      });
    }
    console.log("player disconnected");
  })
  socket.on('playerDisconnect',function(){
    var j =0;
    playerIDArray.forEach((playerID)=>{
      if(socket.id == playerID){
        if(j%2==0){
          io.to(playerIDArray[j+1]).emit('opponentDisconnect',{opponentID:socket.id});
        }
        else{
          io.to(playerIDArray[j-1]).emit('opponentDisconnect',{opponentID:socket.id});
        }
      }
      j++;
    });

    console.log("player disconnected");
  })
})
