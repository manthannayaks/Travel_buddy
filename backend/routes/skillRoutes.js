const express = require('express');
const router = express.Router();
const { getSkills, addSkill } = require('../controllers/skillController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getSkills);
router.post('/', protect, addSkill);

module.exports = router;
