const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./lib/swagger');

const authMiddleware = require('./middleware/auth');
const loggerMiddleware = require('./middleware/logger');

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', require('./routes/auth'));
app.use('/contacts', authMiddleware, require('./routes/contacts'));
app.use('/logs', authMiddleware, require('./routes/logs'));

app.get('/', (req, res) => {
  res.json({ message: 'ContactVault backend is running' });
});

module.exports = app;
