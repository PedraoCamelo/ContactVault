const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('../lib/redis');

const router = express.Router();

const TOKEN_TTL = 3600;

/**
 * @openapi
 * /auth/validate:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange an API key for a JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [apiKey]
 *             properties:
 *               apiKey:
 *                 type: string
 *                 example: my-secret-key
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing apiKey
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid apiKey
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/validate', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'apiKey is required' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid apiKey' });
  }

  const token = jwt.sign({ authorized: true }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });

  await redis.set(`token:${token}`, '1', 'EX', TOKEN_TTL);

  res.json({ token });
});

module.exports = router;
