const asyncHandler = require('../utils/asyncHandler');
const pollService = require('../services/poll.service');

function createPollHandlers(io) {
  const create = asyncHandler(async (req, res) => {
    const poll = await pollService.createPoll(req.user, req.body);
    res.status(201).json(poll);
  });

  const listMine = asyncHandler(async (req, res) => {
    const polls = await pollService.listPollsForUser(req.user);
    res.json(polls);
  });

  const listPublic = asyncHandler(async (req, res) => {
    const polls = await pollService.listPublicPolls();
    res.json(polls);
  });

  const getById = asyncHandler(async (req, res) => {
    const poll = await pollService.getPollById(req.params.id);
    res.json(poll);
  });

  const remove = asyncHandler(async (req, res) => {
    await pollService.deletePoll(req.params.id, req.user);
    res.status(200).json({ message: 'Poll deleted successfully' });
  });

  const update = asyncHandler(async (req, res) => {
    const poll = await pollService.updatePoll(req.params.id, req.user, req.body);
    res.status(200).json(poll);
  });

  const vote = asyncHandler(async (req, res) => {
    const poll = await pollService.voteOnPoll(req.params.id, req.user, req.body);
    io.to(poll._id.toString()).emit('voteUpdate', poll);
    res.status(200).json({ message: 'Vote recorded successfully', poll });
  });

  return {
    create,
    listMine,
    listPublic,
    getById,
    remove,
    update,
    vote,
  };
}

module.exports = {
  createPollHandlers,
};
