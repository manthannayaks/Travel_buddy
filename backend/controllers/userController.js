const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { OAuth2Client } = require('google-auth-library');

// In-Memory store for mock OTPs (Phone -> OTP mapping)
const otpStore = new Map();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretpassword123', {
    expiresIn: '30d',
  });
};

// @desc    Generate mock SMS OTP
// @route   POST /api/users/generate-otp
// @access  Public
const generateOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });
  
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in memory
  otpStore.set(phoneNumber, otp);
  
  // Mock SMS behavior by printing securely to backend terminal
  console.log(`\n========================================`);
  console.log(`📱 MOCK SMS TO ${phoneNumber}`);
  console.log(`🔒 Your TravelBuddy Verification Code is: ${otp}`);
  console.log(`========================================\n`);

  // Return OTP in response for mobile app development (replace with real SMS in production)
  res.status(200).json({ message: 'OTP sent successfully', otp: otp });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, location, idDocument, otp } = req.body;

    // 1. Verify OTP first
    if (!otpStore.has(phoneNumber) || otpStore.get(phoneNumber) !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Clear OTP tightly after consumption
    otpStore.delete(phoneNumber);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      location: location || null,
      idDocument: idDocument || '',
      verificationStatus: idDocument ? 'Pending' : 'Pending', // Automatically pending
    });

    if (user) {
      // Log signup activity
      await ActivityLog.create({ user: user._id, action: 'SIGNUP', details: `New user registered: ${user.email}` });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        location: user.location,
        verificationStatus: user.verificationStatus,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Log login activity
    await ActivityLog.create({ user: user._id, action: 'LOGIN', details: `User logged in: ${user.email}` });
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Auth user & get token via Google
// @route   POST /api/users/google
// @access  Public
const authGoogleUser = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user securely
      const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
      user = await User.create({
        name,
        email,
        password: randomPassword,
        phoneNumber: 'Not provided' // Google auth doesn't give phone number
      });
    }

    // Log Google auth activity
    await ActivityLog.create({ user: user._id, action: 'GOOGLE_AUTH', details: `Google sign-in: ${user.email}` });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(401).json({ message: 'Google Auth failed or missing CLIENT_ID in .env' });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.hobbies = req.body.hobbies || user.hobbies;
      user.skills = req.body.skills || user.skills;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        bio: updatedUser.bio,
        hobbies: updatedUser.hobbies,
        skills: updatedUser.skills,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  generateOTP,
  registerUser,
  loginUser,
  authGoogleUser,
  getMe,
  updateUserProfile,
};
