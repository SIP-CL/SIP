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


// Get all reviews by Cafe ID so once a user clicks on a cafe, they can see all the reviews for that cafe
exports.getAllbyCafe = async (req, res) => {
    try {
        const { cafeID } = req.params;
        const reviews = await reviewCollection.find({ cafeID }).toArray();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews by cafe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.postReview = async (req, res) => {
    const {
      user,
      userID,
      postID,
      cafeID,
      overall,
      drinkQuality,
      vibe,
      ammenities,
      cafeComments,
      selectedLabels,
      drinkReccomendations,
      coffee,
      matcha,
      tea,
      specialty,
      date,
    } = req.body;
  
    // Define known label categories
    const GOOD_LABELS = new Set([
      "Study Spot",
      "Pastries",
      "Late-night",
      "Comfy Seats",
      "Pet Friendly",
      "Good Music",
      "Outlets",
      "Free Wifi",
      "Group Friendly",
      "Good Service",
      "Natural Light"
    ]);
  
    const BAD_LABELS = new Set([
      "Loud Music",
      "Inconsistent",
      "Bad Seating",
      "Stuffy",
      "No Wifi",
      "No Bathroom",
      "No Outlets",
      "Long Wait",
      "Bad Service",
      "Time Limit",
      "Dirty"
    ]);
  
    // Categorize selected labels
    const good = [];
    const bad = [];
  
    if (Array.isArray(selectedLabels)) {
      for (const label of selectedLabels) {
        if (GOOD_LABELS.has(label)) good.push(label);
        else if (BAD_LABELS.has(label)) bad.push(label);
      }
    }
  
    try {
      const newReview = {
        user,
        userID,
        postID,
        cafeID,
        ratings: {
          overall: Number(overall),
          drinkQuality: Number(drinkQuality),
          vibe: Number(vibe),
          ammenities: Number(ammenities),
          drinks: {
            coffee: Number(coffee),
            matcha: Number(matcha),
            tea: Number(tea),
            specialty: Number(specialty),
          }
        },
        cafeComments: cafeComments || '',
        drinkReccomendations: drinkReccomendations || '',
        labels: { good, bad }, // ✅ Categorized labels
        date: date ? new Date(date) : new Date(),
      };
  
      const result = await reviewCollection.insertOne(newReview);
      const inserted = await reviewCollection.findOne({ _id: result.insertedId });
  
      res.status(201).json(inserted);
    } catch (error) {
      console.error("Error posting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  