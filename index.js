var fs=require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var i =0;
var playerIDArray =[];
var gameData=[];
server.listen(3000,()=>{
  console.log("server running");
});

io.on('connection',function(socket){
  console.log("socket connected");
  playerIDArray.push(socket.id);
  i++;
  socket.emit('socketID',{id: socket.id, playerStart: i})
  if (i%2==0){
    gameID=gameData.length;
    gameData.push([]);
    io.to(playerIDArray[i-2]).emit('playerConnected',{opponentID: playerIDArray[i-1],gameName:gameID});
    socket.emit('playerConnected',{opponentID: playerIDArray[i-2],gameName:gameID});
  }
  socket.on('startGame',(opponentData)=>{
    io.to(opponentData.opponentID).emit('startGame',{opponentID:socket.id});
  })
  socket.on('gameOver',(pointData)=>{
    fs.appendFile('CollectedGameData.json', JSON.stringify(gameData[pointData.gameName])+',',function(err){
    if (err) throw err;
    console.log("game added successfully")
    });
    io.to(pointData.opponentID).emit('gameOver',{points:pointData.points,opponentID:socket.id});
  })
  socket.on('defenderMove',(defenderData)=>{
    var next_move={PieceID:defenderData.uniquePieceID, Position:defenderData.coordinates};
    gameData[defenderData.gameID].push(next_move);
    io.to(defenderData.opponentID).emit('defenderMove',defenderData);
  })
  socket.on('attackerMove',(attackerData)=>{
    var next_move={PieceID:attackerData.uniquePieceID, Position:attackerData.coordinates};
    gameData[attackerData.gameID].push(next_move);
    io.to(attackerData.opponentID).emit('attackerMove',attackerData);
  })
  socket.on('disconnect',function(){
    var j =0;
    if(i%2==1){
      i++;
    }
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
