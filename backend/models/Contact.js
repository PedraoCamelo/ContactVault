const mongoose = require('mongoose');

// 1. Define a sub-schema for phone numbers
const phoneSchema = new mongoose.Schema({
  number: { type: String, required: true },
  type: { type: String, enum: ['personal', 'work', 'other'], default: 'personal' }
}, { _id: true }); // each phone sub-document gets its own ID automatically

// 2. Define a sub-schema for addresses
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true }
}, { _id: true });

// 3. Main Contact schema
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  dateOfBirth: { type: Date },
  phoneNumbers: [phoneSchema],   // array of phone sub-documents
  addresses: [addressSchema]    // array of address sub-documents
}, { timestamps: true });       // adds createdAt and updatedAt automatically

// 4. Create and export the model
module.exports = mongoose.model('Contact', contactSchema);