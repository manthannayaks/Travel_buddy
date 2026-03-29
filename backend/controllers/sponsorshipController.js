const Sponsorship = require('../models/Sponsorship');

// @desc    Get all sponsorships
// @route   GET /api/sponsorships
// @access  Public
const getSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find();
    res.status(200).json(sponsorships);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Apply for sponsorship
// @route   POST /api/sponsorships/:id/apply
// @access  Private
const applySponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) return res.status(404).json({ message: 'Sponsorship not found' });

    // Check if already applied
    if (sponsorship.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already applied for this opportunity.' });
    }

    sponsorship.applicants.push(req.user.id);
    await sponsorship.save();

    res.status(200).json({ message: 'Successfully applied!', sponsorship });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Seed sponsorships for MVP
// @route   POST /api/sponsorships/seed
// @access  Public
const seedSponsorships = async (req, res) => {
  try {
    await Sponsorship.deleteMany();
    const seeds = [
      { brand: 'Nomad Gear Co.', title: 'Backpacker Content Campaign', reward: 'Free Gear + $500', requirements: '5K+ IG Followers', icon: '🎒' },
      { brand: 'StayHostels', title: 'Review our new Tokyo branch', reward: '7-night Stay Free', requirements: 'Travel Blogger', icon: '🏨' },
      { brand: 'GoAirlines', title: 'Vlog your flight to Bali', reward: 'Free Roundtrip Flight', requirements: 'YouTube channel (10K+ subs)', icon: '✈️' },
      { brand: 'EcoTours Life', title: 'Eco-conscious Jungle Trek', reward: '$1200 + All Expenses', requirements: 'Nature Photographers', icon: '🌿' },
    ];
    const created = await Sponsorship.insertMany(seeds);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSponsorships,
  applySponsorship,
  seedSponsorships
};
