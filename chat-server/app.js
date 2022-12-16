const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('create_room', function(name, room) {
    socket.join(room);
    socket.broadcast.to(room).emit('user_join', name);
    console.log(name + " joined " + room);
  });

  console.log('new client connected', socket.id);

  socket.on('user_join', (name, room) => {
    console.log('A user joined their name is ' + name);
    socket.broadcast.to(room).emit('user_join', name);
  });

  socket.on('message', ({name, message}, room) => {
    console.log(name, message, socket.id);
    io.to(room).emit('message', {name, message});
  });

  socket.on('leave_room', (name, room) => {
    socket.leave(room);
    socket.broadcast.to(room).emit('user_leave', name);
    console.log(name + ' left room ' + room);
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});