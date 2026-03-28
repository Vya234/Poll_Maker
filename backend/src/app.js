const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const createPollRouter = require('./routes/poll.routes');
const { CORS_OPTIONS } = require('./config/constants');
const { notFound, errorHandler } = require('./middleware/error.middleware');

/**
 * Registers HTTP middleware and API routes. Poll routes are created with the Socket.IO instance.
 */
function setupExpressApp(app, io) {
  app.use(cors(CORS_OPTIONS));
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/polls', createPollRouter(io));
  app.use(notFound);
  app.use(errorHandler);
}

module.exports = {
  setupExpressApp,
};
