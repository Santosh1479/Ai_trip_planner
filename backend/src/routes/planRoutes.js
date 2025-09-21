const express = require('express');
const router = express.Router();
const { planTrip, getTripById, createTrip } = require('../controllers/planController');

router.post('/', planTrip); // This does Gemini + save
router.get('/:id', getTripById);

// Add this route for just creating a trip (no Gemini)
router.post('/create', createTrip);

module.exports = router;