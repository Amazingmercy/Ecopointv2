const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true }, // e.g., UNILAG, UI
  logoUrl: String,
  address: String,
  email: { type: String, required: true },
  password: { type: String, required: true }, // Hash this!
  createdAt: { type: Date, default: Date.now }
});

const School = mongoose.model('School', schoolSchema);
module.exports = School;
