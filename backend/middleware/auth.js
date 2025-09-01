// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function signVideoToken(payload) {
  return jwt.sign(payload, process.env.VIDEO_TOKEN_SECRET, { expiresIn: process.env.VIDEO_TOKEN_EXPIRES || '7d' });
}

function verifyVideoToken(token) {
  try {
    return jwt.verify(token, process.env.VIDEO_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { authMiddleware, signVideoToken, verifyVideoToken };
