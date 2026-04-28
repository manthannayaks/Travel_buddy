const User = require('../models/User');
const Trip = require('../models/Trip');
const Sponsorship = require('../models/Sponsorship');
const Skill = require('../models/Skill');

// @desc    Get complete platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const tripCount = await Trip.countDocuments();
    const sponsorCount = await Sponsorship.countDocuments();
    const skillCount = await Skill.countDocuments();

    res.json({
      users: userCount,
      trips: tripCount,
      sponsorships: sponsorCount,
      skills: skillCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform statistics' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Cannot delete another admin' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// @desc    Make user an admin 
// @route   PUT /api/admin/promote/:id
// @access  Private/Admin
const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isAdmin = true;
      await user.save();
      res.json({ message: 'User promoted to Admin successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error promoting user' });
  }
};

// @desc    One-time script to create the first admin
// @route   POST /api/admin/setup-first-admin
// @access  Public (Only works if 0 admins exist)
const setupFirstAdmin = async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin already exists. Security locked.' });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    user.isAdmin = true;
    await user.save();
    res.json({ message: 'Success! You are now the Platform Admin.', user });
  } catch(err) {
    res.status(500).json({ message: 'Error setting up admin' });
  }
}

module.exports = {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  promoteToAdmin,
  setupFirstAdmin
};
