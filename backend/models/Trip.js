const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    index: true // Improve search performance for queries filtering by destination
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  budget: {
    type: Number,
    required: [true, 'Please add an estimated budget']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
