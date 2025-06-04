const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Collector = mongoose.model('Collector', collectorSchema);
module.exports = Collector;