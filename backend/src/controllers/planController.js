const Trip = require('../models/Trip');
const { generateItinerary } = require('../services/aiPlanner');

exports.planTrip = async (req, res) => {
  const {
    startDate,
    endDate,
    destination,
    startingPoint,
    travelers,
    budgetStyle,
    interests,
  } = req.body;
  try {
    const itinerary = await generateItinerary({
      startDate,
      endDate,
      destination,
      startingPoint,
      travelers,
      budgetStyle,
      interests,
    });
    const trip = new Trip({
      startDate,
      endDate,
      destination,
      itinerary,
      startingPoint,
      travelers,
      budgetStyle,
      interests,
    });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to plan trip' });
  }
};