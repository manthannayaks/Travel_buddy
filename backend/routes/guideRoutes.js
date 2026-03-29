const express = require('express');
const router = express.Router();
const { getGuides, seedGuides } = require('../controllers/guideController');

// Define routes
router.get('/', getGuides);
router.post('/seed', seedGuides);

module.exports = router;
