const express = require('express');
const path = require('path');
const { createServer } = require('http');
const socketIO = require('socket.io');

// Initialize Express
const app = express();

// Serve static files from a 'static' directory
app.use('/', express.static(path.join(__dirname, 'static')));

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO with the created HTTP server
const io = socketIO(httpServer);

let connectedUsers = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
  connectedUsers[socket.id] = socket;

  // Emit updated user list
  io.emit('updateUserList', Object.keys(connectedUsers));

  // Handle call initiation
  socket.on('startCall', (data) => {
    const { to } = data;
    if (connectedUsers[to]) {
      connectedUsers[to].emit('callIncoming', socket.id);
    }
  });

  // Handle signal exchange
  socket.on('signal', (data) => {
    const { to, ...signalData } = data;
    if (connectedUsers[to]) {
      connectedUsers[to].emit('signal', { from: socket.id, ...signalData });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    io.emit('updateUserList', Object.keys(connectedUsers));
  });
});

// Set the server to listen on the specified port or default to 3500
let port = process.env.PORT || 3500;

httpServer.listen(port, () => {
  console.log("Server started on port", port);
});