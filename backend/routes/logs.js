const express = require('express');
const Log = require('../models/Log');

const router = express.Router();

/**
 * @openapi
 * /logs:
 *   get:
 *     tags: [Logs]
 *     summary: List the last 100 request logs
 *     responses:
 *       200:
 *         description: Array of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
