require('dotenv').config();

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { connectDatabase } = require('./config/database');
const { SOCKET_IO_CORS } = require('./config/constants');
const { setupExpressApp } = require('./app');
const { registerPollSockets } = require('./sockets/poll.socket');

async function start() {
  await connectDatabase();
  console.log('MongoDB connected');

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: SOCKET_IO_CORS });

  setupExpressApp(app, io);
  registerPollSockets(io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
