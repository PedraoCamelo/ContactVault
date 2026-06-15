const jwt = require('jsonwebtoken');
const redis = require('../lib/redis');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const exists = await redis.get(`token:${token}`);
  if (!exists) {
    return res.status(401).json({ error: 'Token not found or revoked' });
  }

  next();
};
