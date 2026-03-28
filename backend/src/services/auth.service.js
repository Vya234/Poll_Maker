const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signUserToken } = require('../utils/token');

function buildAuthResponse(user) {
  const token = signUserToken(user._id);
  return {
    token,
    user: { id: user._id, username: user.username },
  };
}

async function signup({ username, password }) {
  if (!username || !password) {
    throw new AppError('Username and password are required', 400);
  }
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }

  const existing = await User.findOne({ username });
  if (existing) {
    throw new AppError('User already exists', 400);
  }

  const user = new User({ username, password });
  await user.save();
  return buildAuthResponse(user);
}

async function login({ username, password }) {
  if (!username || !password) {
    throw new AppError('Username and password are required', 400);
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new AppError('Invalid credentials', 400);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 400);
  }

  return buildAuthResponse(user);
}

module.exports = {
  signup,
  login,
};
