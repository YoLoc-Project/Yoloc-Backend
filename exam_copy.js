const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for 'message' event from client
  socket.on('message', (data) => {
    console.log(`Received message: ${data}`);

    // Emit 'message' event to Flask client
    io.emit('message', data);
  });
});