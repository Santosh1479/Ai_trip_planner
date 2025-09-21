const Trip = require('../models/Trip');
const { generateItinerary } = require('../services/aiPlanner');

exports.planTrip = async (req, res) => {
  try {
    const itinerary = await generateItinerary(req.body);

    // Save trip to DB
    const trip = new Trip({
      ...req.body,
      itinerary,
    });
    await trip.save();

    res.json({ itinerary, id: trip._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // If itinerary is missing or empty, generate it
    if (!trip.itinerary || trip.itinerary.length === 0) {
      const itinerary = await generateItinerary({
        startDate: trip.startDate,
        endDate: trip.endDate,
        destination: trip.destination,
        startingPoint: trip.startingPoint,
        travelers: trip.travelers,
        budgetStyle: trip.budgetStyle,
        interests: trip.interests,
      });
      trip.itinerary = itinerary;
      await trip.save();
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.json({ id: trip._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};