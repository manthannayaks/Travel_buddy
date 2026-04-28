const Trip = require('../models/Trip');
const ActivityLog = require('../models/ActivityLog');

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
      user: req.user.id,
      destination,
      startDate,
      endDate,
      budget
    });

    // Log activity
    await ActivityLog.create({ user: req.user.id, action: 'TRIP_CREATED', details: `Trip to ${destination}` });

    // Return populated trip
    const populatedTrip = await Trip.findById(trip._id).populate('user', 'name email');
    res.status(201).json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get matching trips (same destination)
// @route   GET /api/trips/matches
// @access  Private
const getMatches = async (req, res) => {
  const { destination } = req.query;

  try {
    const matches = await Trip.find({
      user: { $ne: req.user.id },
      destination: new RegExp(destination, 'i')
    }).populate('user', 'name email');

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getMatches
};
