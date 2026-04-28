const Guide = require('../models/Guide');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get locals/guides based on location query
// @route   GET /api/guides?location=value
// @access  Public
const getGuides = async (req, res) => {
  const { location } = req.query;
  
  try {
    let query = {};
    if (location && location !== 'All Locations') {
      query.location = new RegExp(location, 'i');
    }

    const guides = await Guide.find(query).sort({ createdAt: -1 });
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register as a local guide
// @route   POST /api/guides
// @access  Private
const createGuide = async (req, res) => {
  const { location, expertise, languages, price } = req.body;

  if (!location || !expertise || !price) {
    return res.status(400).json({ message: 'Please provide location, expertise, and price' });
  }

  try {
    const guide = await Guide.create({
      user: req.user.id,
      name: req.user.name,
      location,
      expertise,
      languages: languages || ['English'],
      price
    });

    // Log activity
    await ActivityLog.create({ user: req.user.id, action: 'GUIDE_REGISTERED', details: `Registered as guide in ${location}` });

    res.status(201).json(guide);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Seed some initial guides for demo purposes
// @route   POST /api/guides/seed
// @access  Public
const seedGuides = async (req, res) => {
  try {
    await Guide.deleteMany();
    
    const sampleGuides = [
      { name: 'Marco Rossi', location: 'Rome, Italy', expertise: 'History & Arts', languages: ['Italian', 'English'], price: '€20/hr', rating: 4.9 },
      { name: 'Sakura Tanaka', location: 'Kyoto, Japan', expertise: 'Culture & Food', languages: ['Japanese', 'English'], price: '¥2500/hr', rating: 5.0 },
      { name: 'Elena Costa', location: 'Rio de Janeiro', expertise: 'Nightlife & Beaches', languages: ['Portuguese', 'Spanish'], price: '$15/hr', rating: 4.8 },
      { name: 'Kenji Sato', location: 'Tokyo, Japan', expertise: 'Photography', languages: ['Japanese', 'English', 'Korean'], price: '¥3000/hr', rating: 4.9 }
    ];

    const createdGuides = await Guide.insertMany(sampleGuides);
    res.status(201).json(createdGuides);
  } catch (error) {
    res.status(500).json({ message: 'Error seeding data' });
  }
};

module.exports = {
  getGuides,
  createGuide,
  seedGuides
};
