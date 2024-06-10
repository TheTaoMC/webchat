import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
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
  }
  res.end();
}
