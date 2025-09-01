const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/getAll', reviewController.getAll);

router.post('/postReview', reviewController.postReview);

router.get('/getAllbyCafe/:cafeID', reviewController.getAllbyCafe);

module.exports = router;
