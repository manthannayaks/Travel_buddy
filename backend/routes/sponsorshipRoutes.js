const express = require('express');
const router = express.Router();
const { getSponsorships, applySponsorship, seedSponsorships } = require('../controllers/sponsorshipController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getSponsorships);
router.post('/seed', seedSponsorships);
router.post('/:id/apply', protect, applySponsorship);

module.exports = router;
