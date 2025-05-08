const express = require('express');
const cafeRoutes = require('./routes/cafeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cors = require('cors');

const app = express();

app.use(cors()); 

// Middleware
app.use(express.json());

// Routes
app.use('/cafes', cafeRoutes);

app.use('/review', reviewRoutes);

module.exports = app;
