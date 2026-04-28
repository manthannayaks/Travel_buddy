const Skill = require('../models/Skill');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all skill exchange posts
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a skill exchange listing
// @route   POST /api/skills
// @access  Private
const addSkill = async (req, res) => {
  const { skills, lookingFor, description } = req.body;

  try {
    const newSkill = await Skill.create({
      user: req.user.id,
      skills,
      lookingFor,
      description
    });

    // Log activity
    await ActivityLog.create({ user: req.user.id, action: 'SKILL_POSTED', details: `Skills: ${skills.join(', ')} | Looking for: ${lookingFor}` });

    const populatedSkill = await Skill.findById(newSkill._id).populate('user', 'name');
    res.status(201).json(populatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSkills,
  addSkill
};
