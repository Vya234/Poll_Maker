const express = require('express');
const { requireAuth, optionalAuth } = require('../middleware/auth.middleware');
const { createPollHandlers } = require('../controllers/poll.controller');

/**
 * Poll routes need Socket.IO for live vote updates; the router factory receives the server `io` instance.
 */
function createPollRouter(io) {
  const router = express.Router();
  const handlers = createPollHandlers(io);

  router.post('/', requireAuth, handlers.create);
  router.get('/', requireAuth, handlers.listMine);
  router.get('/public', requireAuth, handlers.listPublic);
  router.get('/:id', optionalAuth, handlers.getById);
  router.delete('/:id', requireAuth, handlers.remove);
  router.put('/:id', requireAuth, handlers.update);
  router.post('/:id/vote', optionalAuth, handlers.vote);

  return router;
}

module.exports = createPollRouter;
