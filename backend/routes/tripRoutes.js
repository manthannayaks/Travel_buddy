const express = require('express');
const router = express.Router();
const { createTrip, getMatches } = require('../controllers/tripController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createTrip);
router.get('/matches', protect, getMatches);

module.exports = router;
