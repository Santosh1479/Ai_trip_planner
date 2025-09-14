const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  startDate: String,
  endDate: String,
  destination: String,
  startingPoint: String,
  travelers: Number,
  budgetStyle: String,
  interests: String,
  itinerary: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);