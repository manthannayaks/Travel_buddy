const Trip = require('../models/Trip');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  const { destination, startDate, endDate, budget } = req.body;

  if (!destination || !startDate || !endDate || !budget) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const trip = await Trip.create({
      user: req.user.id, // Comes from protect middleware
      destination,
      startDate,
      endDate,
      budget
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get matching trips (same destination)
// @route   GET /api/trips/matches?destination=value
// @access  Private
const getMatches = async (req, res) => {
  const { destination } = req.query;

  try {
    // Find trips by other users with roughly the same destination
    // In a real app, this would use geospatial data or better string matching
    const matches = await Trip.find({
      user: { $ne: req.user.id }, // Exclude current user
      destination: new RegExp(destination, 'i') // Case insensitive match
    }).populate('user', 'name email'); // Bring in user details

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTrip,
  getMatches
};
