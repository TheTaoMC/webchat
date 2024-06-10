const express = require('express');
const { createServer } = require('http');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
