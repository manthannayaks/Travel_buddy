const express = require('express');
const router = express.Router();
const { getGuides, createGuide, seedGuides } = require('../controllers/guideController');
const { protect } = require('../middlewares/authMiddleware');

// Define routes
router.get('/', getGuides);
router.post('/', protect, createGuide);
router.post('/seed', seedGuides);

module.exports = router;
