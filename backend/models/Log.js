const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  method: { type: String, required: true },
  path: { type: String, required: true },
  status: { type: Number, required: true },
  durationMs: { type: Number, required: true },
  ip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
