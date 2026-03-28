const Poll = require('../models/Poll');
const AppError = require('../utils/AppError');

function normalizeOptionsFromBody(options) {
  return options.map((opt) => ({ text: opt, votes: 0, voters: [] }));
}

async function findPollByIdOrThrow(id, populateCreatedBy = false) {
  const query = Poll.findById(id);
  if (populateCreatedBy) {
    query.populate('createdBy', 'username');
  }
  const poll = await query;
  if (!poll) {
    throw new AppError('Poll not found', 404);
  }
  return poll;
}

function assertPollOwner(poll, userId) {
  if (poll.createdBy.toString() !== userId) {
    throw new AppError('Unauthorized', 403);
  }
}

async function createPoll(userId, body) {
  const { title, pollType, options, settings } = body;

  if (!title || !pollType || !options || options.length < 2) {
    throw new AppError('Title, poll type, and at least 2 options are required', 400);
  }

  const poll = new Poll({
    title,
    pollType,
    options: normalizeOptionsFromBody(options),
    settings,
    createdBy: userId,
  });

  await poll.save();
  return poll;
}

async function listPollsForUser(userId) {
  return Poll.find({ createdBy: userId }).populate('createdBy', 'username');
}

async function listPublicPolls() {
  return Poll.find().populate('createdBy', 'username');
}

async function getPollById(id) {
  return findPollByIdOrThrow(id, true);
}

async function deletePoll(id, userId) {
  const poll = await findPollByIdOrThrow(id);
  assertPollOwner(poll, userId);
  await poll.deleteOne();
}

async function updatePoll(id, userId, body) {
  const { title, pollType, options, settings } = body;
  const poll = await findPollByIdOrThrow(id);
  assertPollOwner(poll, userId);

  poll.title = title || poll.title;
  poll.pollType = pollType || poll.pollType;
  if (options) {
    poll.options = normalizeOptionsFromBody(options);
  }
  poll.settings = settings || poll.settings;

  await poll.save();
  return poll;
}

async function voteOnPoll(id, userId, body) {
  const { optionIndices, voterName } = body;
  const poll = await findPollByIdOrThrow(id);

  if (poll.settings.requireNames && !voterName) {
    throw new AppError('Voter name is required', 400);
  }

  const resolvedUserId = userId || null;

  const hasVoted = poll.options.some((option) =>
    option.voters.some(
      (voter) =>
        (voter.userId && voter.userId.toString() === resolvedUserId) ||
        (voter.name && voter.name === voterName),
    ),
  );

  if (hasVoted) {
    throw new AppError('You have already voted on this poll', 400);
  }

  if (!optionIndices || !Array.isArray(optionIndices) || optionIndices.length === 0) {
    throw new AppError('At least one option must be selected', 400);
  }

  if (
    optionIndices.length > 1 &&
    (!poll.settings.allowMultiple || poll.pollType === 'Single Choice')
  ) {
    throw new AppError('Multiple selections are not allowed for this poll', 400);
  }

  for (const index of optionIndices) {
    if (index < 0 || index >= poll.options.length) {
      throw new AppError('Invalid option selected', 400);
    }
    poll.options[index].votes += 1;
    poll.options[index].voters.push({
      userId: resolvedUserId,
      name: poll.settings.requireNames ? voterName : null,
    });
  }

  await poll.save();
  return poll;
}

module.exports = {
  createPoll,
  listPollsForUser,
  listPublicPolls,
  getPollById,
  deletePoll,
  updatePoll,
  voteOnPoll,
};
