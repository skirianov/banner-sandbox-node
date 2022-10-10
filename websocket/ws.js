const { WebSocketServer } = require('ws');

let ws;

module.exports = {
  init: server => {
    ws = new WebSocketServer({ server });
    return ws;
  },
  getWS: () => {
    if (!ws) {
      throw new Error('Socket.io not initialized!');
    }
    return ws;
  }
}