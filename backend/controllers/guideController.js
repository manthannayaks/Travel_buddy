const Guide = require('../models/Guide');

// @desc    Get locals/guides based on location query
// @route   GET /api/guides?location=value
// @access  Public
const getGuides = async (req, res) => {
  const { location } = req.query;
  
  try {
    let query = {};
    if (location && location !== 'All Locations') {
      query.location = new RegExp(location, 'i'); // Case insensitive regex match
    }

    const guides = await Guide.find(query);
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Seed some initial guides for demo purposes
// @route   POST /api/guides/seed
// @access  Public
const seedGuides = async (req, res) => {
  try {
    await Guide.deleteMany(); // Clear existing
    
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
  seedGuides
};
