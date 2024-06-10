import { WebSocketServer } from 'ws';

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    console.log('Initializing WebSocket server...');
    const wss = new WebSocketServer({ noServer: true });

    res.socket.server.on('upgrade', (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(message);
          }
        });
      });
    });

    res.socket.server.wss = wss;
  } else {
    console.log('WebSocket server already initialized.');
  }
  res.end();
}
