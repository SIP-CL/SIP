const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');

// Existing routes
router.get('/getAll', cafeController.getAll);
router.get('/name/:name', cafeController.getByName);

// ✅ NEW: Search cafes by name (partial match)
router.get('/search', cafeController.searchCafes);

// ✅ NEW: Get cafes by ID
router.get('/getByID/:cafeID', cafeController.getByID);

router.get('/getGoodLabelsByID/:cafeID', cafeController.getGoodLabelsByID)

router.get('/getBadLabelsByID/:cafeID', cafeController.getBadLabelsByID)

module.exports = router;
