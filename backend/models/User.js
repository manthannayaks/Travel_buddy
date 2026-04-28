const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    default: ''
  },
  hobbies: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  idDocument: {
    type: String,
    default: ''
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  // If the password isn't modified (e.g., updating user name), skip hashing
  if (!this.isModified('password')) {
    next();
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
