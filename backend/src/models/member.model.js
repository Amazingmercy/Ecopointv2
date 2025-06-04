const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Hash this!
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  points: { type: Number, default: 0 },
  badges: [{ name: String, dateEarned: Date }],
  createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
