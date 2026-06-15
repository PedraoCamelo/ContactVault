const { publish } = require('../lib/rabbitmq');

module.exports = (req, res, next) => {
  if (process.env.LOGGER !== 'ON') return next();

  const start = Date.now();

  res.on('finish', () => {
    publish({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    }).catch((err) => console.error('Logger publish error:', err));
  });

  next();
};
