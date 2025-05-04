require('dotenv').config();
const app = require('./app');
const connectToMongo = require('./config/db');
const cafeController = require('./controllers/cafeController');
const reviewController = require('./controllers/reviewController');


const port = process.env.PORT || 3000;

(async () => {
  const db = await connectToMongo();
  cafeController.setCafeCollection(db); // Make cafesCollection available
  reviewController.setReviewCollection(db); // Make reviewsCollection available
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
