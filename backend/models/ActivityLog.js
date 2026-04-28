const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'SIGNUP', 'GOOGLE_AUTH', 'TRIP_CREATED', 'SKILL_POSTED', 'GUIDE_REGISTERED', 'PROFILE_UPDATED', 'GUIDE_SEARCHED', 'TRIP_SEARCHED']
  },
  details: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for fast admin queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
