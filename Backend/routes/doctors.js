const express = require('express');
const router = express.Router();
const { fetchNearbyDoctors, refreshNearbyDoctors } = require('../controllers/doctorController');


router.get('/nearby', fetchNearbyDoctors);
router.post('/nearby', refreshNearbyDoctors);

module.exports = router;