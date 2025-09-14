const express = require('express');
const router = express.Router();
const { planTrip } = require('../controllers/planController');

router.post('/', planTrip);

module.exports = router;