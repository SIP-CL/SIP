const express = require('express');
const cafeRoutes = require('./routes/cafeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/cafes', cafeRoutes);

app.use('/review', reviewRoutes);

module.exports = app;
