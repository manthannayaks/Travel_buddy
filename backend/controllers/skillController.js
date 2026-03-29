const Skill = require('../models/Skill');

// @desc    Get all skill exchange posts
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate('user', 'name email');
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
    
    // Populate user before sending back
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
