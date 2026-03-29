const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    index: true // Improve search performance for queries filtering by location
  },
  expertise: {
    type: String,
    required: true
  },
  languages: {
    type: [String],
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 5.0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guide', guideSchema);
