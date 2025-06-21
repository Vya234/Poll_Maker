// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  console.log('Signup attempt - Received:', { username, password });

  try {
    if (!username || !password) {
      console.log('Signup failed - Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
      console.log('Signup failed - Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let user = await User.findOne({ username });
    if (user) {
      console.log('Signup failed - User already exists:', username);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, password });
    await user.save();
    console.log('User saved successfully:', user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error('Signup error:', err.message, err.stack);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt - Received:', { username, password });

  try {
    if (!username || !password) {
      console.log('Login failed - Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login failed - User not found:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Login failed - Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;