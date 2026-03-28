/**
 * Real-time rooms per poll; clients emit `joinPoll` with the poll id to receive `voteUpdate` broadcasts.
 */
function registerPollSockets(io) {
  io.on('connection', (socket) => {
    socket.on('joinPoll', (pollId) => {
      socket.join(pollId);
    });
  });
}

module.exports = {
  registerPollSockets,
};
