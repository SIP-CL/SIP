const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');

router.get('/getAll', cafeController.getAll);

router.get('/getByName/:name', cafeController.getByName);

module.exports = router;
