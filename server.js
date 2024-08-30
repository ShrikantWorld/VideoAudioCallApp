// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let connectedUsers = {};

io.on('connection', (socket) => {
  connectedUsers[socket.id] = socket;

  io.emit('updateUserList', Object.keys(connectedUsers));

  socket.on('startCall', (data) => {
    const { to } = data;
    if (connectedUsers[to]) {
      connectedUsers[to].emit('callIncoming', socket.id);
    }
  });

  socket.on('signal', (data) => {
    const { to, ...signalData } = data;
    if (connectedUsers[to]) {
      connectedUsers[to].emit('signal', { from: socket.id, ...signalData });
    }
  });

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    io.emit('updateUserList', Object.keys(connectedUsers));
  });
});

server.listen(3000, () => {
  console.log('Signaling server is running on port 3000');
});
