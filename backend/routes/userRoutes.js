const express = require('express');
const router = express.Router();
const { registerUser, loginUser, authGoogleUser, getMe, updateUserProfile, generateOTP } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate-otp', generateOTP);
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/google', authGoogleUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
