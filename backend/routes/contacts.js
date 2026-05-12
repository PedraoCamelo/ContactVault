const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /contacts – create a new contact
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;