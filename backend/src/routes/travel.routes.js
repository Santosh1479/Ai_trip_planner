const express = require('express');
const router = express.Router();
const amadeus = require('../utils/amadeus');

// ✈️ Fetch flight offers
router.get('/flights', async (req, res) => {
  const { origin, destination, departureDate } = req.query;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: 'Missing origin, destination, or departureDate' });
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults: 1,
      max: 5,
    });

    const flights = response.data.map(flight => ({
      airline: flight.validatingAirlineCodes[0],
      price: flight.price.total,
      currency: flight.price.currency,
      from: origin,
      to: destination,
      bookLink: `https://www.google.com/search?q=${flight.validatingAirlineCodes[0]}+flight+from+${origin}+to+${destination}`,
    }));

    res.json(flights);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// 🏨 Fetch hotels by city code
router.get('/hotels', async (req, res) => {
  const { cityCode } = req.query;

  if (!cityCode) {
    return res.status(400).json({ error: 'Missing cityCode' });
  }

  try {
    const response = await amadeus.referenceData.locations.hotels.byCity.get({ cityCode });

    const hotels = response.data.map(hotel => ({
      name: hotel.name,
      hotelId: hotel.hotelId,
      chainCode: hotel.chainCode,
      bookLink: `https://www.google.com/search?q=${hotel.name}+hotel+in+${cityCode}`,
    }));

    res.json(hotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

module.exports = router;
