// routes/polls.js
const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
    } catch (err) {
      // If token is invalid, proceed without user ID (anonymous vote)
    }
  }
  next();
};

module.exports = (io) => {
  // Create a new poll (requires authentication)
  router.post('/', authMiddleware, async (req, res) => {
    const { title, pollType, options, settings } = req.body;
    console.log('Creating poll for user ID:', req.user, 'with data:', { title, pollType, options, settings });

    try {
      if (!title || !pollType || !options || options.length < 2) {
        return res.status(400).json({ message: 'Title, poll type, and at least 2 options are required' });
      }

      const poll = new Poll({
        title,
        pollType,
        options: options.map(opt => ({ text: opt, votes: 0, voters: [] })),
        settings,
        createdBy: req.user,
      });

      await poll.save();
      console.log('Poll created successfully:', poll._id);
      res.status(201).json(poll);
    } catch (err) {
      console.error('Error creating poll:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get all polls created by the user (requires authentication)
  router.get('/', authMiddleware, async (req, res) => {
    console.log('Fetching polls for user ID:', req.user);
    try {
      const polls = await Poll.find({ createdBy: req.user }).populate('createdBy', 'username');
      console.log('Polls found:', polls);
      res.json(polls);
    } catch (err) {
      console.error('Error fetching polls:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get all public polls (requires authentication to access the page, but shows all polls)
  router.get('/public', authMiddleware, async (req, res) => {
    console.log('Fetching all public polls');
    try {
      const polls = await Poll.find().populate('createdBy', 'username');
      console.log('Public polls found:', polls);
      res.json(polls);
    } catch (err) {
      console.error('Error fetching public polls:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get a specific poll by ID (does not require authentication for viewing/voting)
  router.get('/:id', optionalAuthMiddleware, async (req, res) => {
    console.log('Fetching poll with ID:', req.params.id);
    try {
      const poll = await Poll.findById(req.params.id).populate('createdBy', 'username');
      if (!poll) {
        console.log('Poll not found:', req.params.id);
        return res.status(404).json({ message: 'Poll not found' });
      }
      console.log('Poll found with votes:', poll.options.map(opt => ({ text: opt.text, votes: opt.votes })));
      res.json(poll);
    } catch (err) {
      console.error('Error fetching poll:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete a poll by ID (requires authentication)
  router.delete('/:id', authMiddleware, async (req, res) => {
    console.log('Deleting poll with ID:', req.params.id, 'for user ID:', req.user);
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        console.log('Poll not found:', req.params.id);
        return res.status(404).json({ message: 'Poll not found' });
      }
      if (poll.createdBy.toString() !== req.user) {
        console.log('Unauthorized delete attempt by user:', req.user);
        return res.status(403).json({ message: 'Unauthorized' });
      }
      await poll.deleteOne();
      console.log('Poll deleted successfully:', req.params.id);
      res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (err) {
      console.error('Error deleting poll:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update a poll by ID (requires authentication)
  router.put('/:id', authMiddleware, async (req, res) => {
    const { title, pollType, options, settings } = req.body;
    console.log('Updating poll with ID:', req.params.id, 'for user ID:', req.user);
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        console.log('Poll not found:', req.params.id);
        return res.status(404).json({ message: 'Poll not found' });
      }
      if (poll.createdBy.toString() !== req.user) {
        console.log('Unauthorized update attempt by user:', req.user);
        return res.status(403).json({ message: 'Unauthorized' });
      }
      poll.title = title || poll.title;
      poll.pollType = pollType || poll.pollType;
      poll.options = options ? options.map(opt => ({ text: opt, votes: 0, voters: [] })) : poll.options;
      poll.settings = settings || poll.settings;
      await poll.save();
      console.log('Poll updated successfully:', poll);
      res.status(200).json(poll);
    } catch (err) {
      console.error('Error updating poll:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Vote on a poll (authentication optional)
  router.post('/:id/vote', optionalAuthMiddleware, async (req, res) => {
    const { optionIndices, voterName } = req.body;
    console.log('Voting on poll ID:', req.params.id, 'with options:', optionIndices, 'voterName:', voterName);

    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        console.log('Poll not found for voting:', req.params.id);
        return res.status(404).json({ message: 'Poll not found' });
      }

      if (poll.settings.requireNames && !voterName) {
        return res.status(400).json({ message: 'Voter name is required' });
      }

      const userId = req.user || null;
      const voterIdentifier = userId || voterName || 'anonymous';
      const hasVoted = poll.options.some(option =>
        option.voters.some(voter =>
          (voter.userId && voter.userId.toString() === userId) ||
          (voter.name && voter.name === voterName)
        )
      );

      if (hasVoted) {
        return res.status(400).json({ message: 'You have already voted on this poll' });
      }

      if (!optionIndices || !Array.isArray(optionIndices) || optionIndices.length === 0) {
        return res.status(400).json({ message: 'At least one option must be selected' });
      }

      if (optionIndices.length > 1 && (!poll.settings.allowMultiple || poll.pollType === 'Single Choice')) {
        return res.status(400).json({ message: 'Multiple selections are not allowed for this poll' });
      }

      for (const index of optionIndices) {
        if (index < 0 || index >= poll.options.length) {
          return res.status(400).json({ message: 'Invalid option selected' });
        }
        poll.options[index].votes += 1;
        poll.options[index].voters.push({
          userId: userId,
          name: poll.settings.requireNames ? voterName : null,
        });
      }

      await poll.save();
      io.to(poll._id.toString()).emit('voteUpdate', poll);
      console.log('Vote recorded successfully for poll:', poll._id);
      res.status(200).json({ message: 'Vote recorded successfully', poll });
    } catch (err) {
      console.error('Error voting on poll:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};