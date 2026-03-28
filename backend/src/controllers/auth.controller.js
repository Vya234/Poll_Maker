const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const signup = asyncHandler(async (req, res) => {
  const payload = await authService.signup(req.body);
  res.status(201).json(payload);
});

const login = asyncHandler(async (req, res) => {
  const payload = await authService.login(req.body);
  res.json(payload);
});

module.exports = {
  signup,
  login,
};
