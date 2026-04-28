const express = require('express');
const router = express.Router();
const { 
  getPlatformStats, 
  getAllUsers, 
  deleteUser, 
  promoteToAdmin, 
  setupFirstAdmin 
} = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/adminMiddleware');

// Public one-time setup
router.post('/setup-first-admin', setupFirstAdmin);

// Protected Admin Routes
router.route('/stats').get(protectAdmin, getPlatformStats);
router.route('/users').get(protectAdmin, getAllUsers);
router.route('/users/:id').delete(protectAdmin, deleteUser);
router.route('/promote/:id').put(protectAdmin, promoteToAdmin);

module.exports = router;
