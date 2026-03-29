const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  title: { type: String, required: true },
  reward: { type: String, required: true },
  requirements: { type: String, required: true },
  icon: { type: String, default: '🎁' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
