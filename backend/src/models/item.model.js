const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  qrCode: { type: String, unique: true }, // Includes school-specific prefix
  type: { type: String, enum: ['bottle', 'bag', 'container'], required: true },
  points: Number,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Collector' },
  scannedByMember: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  scannedAt: Date
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;