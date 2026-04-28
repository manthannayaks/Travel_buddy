const User = require('../models/User');
const Trip = require('../models/Trip');
const Sponsorship = require('../models/Sponsorship');
const Skill = require('../models/Skill');
const Guide = require('../models/Guide');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get complete platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const tripCount = await Trip.countDocuments();
    const sponsorCount = await Sponsorship.countDocuments();
    const skillCount = await Skill.countDocuments();
    const guideCount = await Guide.countDocuments();

    res.json({
      users: userCount,
      trips: tripCount,
      sponsorships: sponsorCount,
      skills: skillCount,
      guides: guideCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform statistics' });
  }
};

// @desc    Get all users with activity summary
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    // Enrich each user with their last activity
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const lastActivity = await ActivityLog.findOne({ user: user._id }).sort({ createdAt: -1 });
      const activityCount = await ActivityLog.countDocuments({ user: user._id });
      return {
        ...user.toObject(),
        lastActivity: lastActivity ? { action: lastActivity.action, date: lastActivity.createdAt } : null,
        totalActivities: activityCount
      };
    }));
    
    res.json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Get activity feed
// @route   GET /api/admin/activity
// @access  Private/Admin
const getActivityFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity feed' });
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
  getActivityFeed,
  deleteUser,
  promoteToAdmin,
  setupFirstAdmin
};
