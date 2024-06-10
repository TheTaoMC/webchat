import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export const dynamic = 'force-dynamic';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
    });
  } else {
    console.log('Socket.io server already running...');
  }
  res.end();
};

export default ioHandler;
