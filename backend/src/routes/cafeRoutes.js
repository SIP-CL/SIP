const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');

// Existing routes
router.get('/getAll', cafeController.getAll);
router.get('/name/:name', cafeController.getByName);

// ✅ NEW: Search cafes by name (partial match)
router.get('/search', cafeController.searchCafes);

module.exports = router;
