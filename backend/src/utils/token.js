const jwt = require('jsonwebtoken');

const TOKEN_PREFIX = /^Bearer\s+/i;

function signUserToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function extractBearerToken(req) {
  const header = req.header('Authorization');
  if (!header) return null;
  return header.replace(TOKEN_PREFIX, '');
}

module.exports = {
  signUserToken,
  extractBearerToken,
};
