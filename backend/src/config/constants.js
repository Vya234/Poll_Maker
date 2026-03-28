/**
 * Shared CORS configuration for Express and Socket.IO so origins stay in one place.
 */
const CORS_ORIGINS = [
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app',
];

const CORS_OPTIONS = {
  origin: CORS_ORIGINS,
  credentials: true,
};

const SOCKET_IO_CORS = {
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST'],
};

module.exports = {
  CORS_ORIGINS,
  CORS_OPTIONS,
  SOCKET_IO_CORS,
};
