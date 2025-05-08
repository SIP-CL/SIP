let reviewCollection;
  
exports.setReviewCollection = (db) => {
    reviewCollection = db.collection("reviews");
  }

exports.getAll = async (req, res) => {
    try {
        const reviews = await reviewCollection.find({}).toArray();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.postReview = async (req, res) => {
    const { userID, postID, cafeID, caption, rating, date } = req.body;

    try {
        const newReview = {
            userID,
            postID,
            cafeID,
            caption: caption || '',
            rating: Array.isArray(rating) ? rating.map(Number) : [], // ensures numeric values
            date: date ? new Date(date) : new Date()
        };

        const result = await reviewCollection.insertOne(newReview);
        const inserted = await reviewCollection.findOne({ _id: result.insertedId });

        res.status(201).json(inserted);
    } catch (error) {
        console.error("Error posting review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
