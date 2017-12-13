var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000,()=>{
  console.log("server running");
});

io.on('connection',function(socket){
  console.log("socket connected");
  socket.on('disconnect',function(){
    console.log("player disconnected");
  })
})
