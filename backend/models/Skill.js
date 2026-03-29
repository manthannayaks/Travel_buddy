const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  lookingFor: { type: String, required: true }, // e.g., 'Free Accommodation'
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
