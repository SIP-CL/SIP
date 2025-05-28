const { ObjectId } = require('mongodb');

let reviewCollection;
  
exports.setReviewCollection = (db) => {
    reviewCollection = db.collection("reviews");
  }

let cafesCollection;

exports.setCafeCollection = (db) => {
  cafesCollection = db.collection("cafes")
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

      // Edit the cafe ratings
      // Update ratings
      const updateRatingField = async (cafeID, fieldPath, newRating) => {
        const cafe = await cafesCollection.findOne({ _id: new ObjectId(cafeID) });
        if (!cafe) return;

        if (Number(newRating) === 0) return

        const currentRating = cafe.ratings?.[fieldPath]
        const updatedCount = currentRating.count + 1
        const updatedRating = ((currentRating.rating * currentRating.count + newRating) / updatedCount)


        await cafesCollection.updateOne(
          // Query
          {_id: new ObjectId(cafeID)},
          // Set
          { $set: {
            [`ratings.${fieldPath}.rating`]: updatedRating,
            [`ratings.${fieldPath}.count`]: updatedCount
          }}
        )
      }

      // Update labels
      const incrementLabelCounts = async (cafeID, goodLabels, badLabels) => {
        const cafe = await cafesCollection.findOne({ _id: new ObjectId(cafeID) });
        if (!cafe) return;

        const updates = {}

        for (const label of goodLabels) {
          updates[`labels.good.${label}`] = 1
        }

        for (const label of badLabels) {
          updates[`labels.bad.${label}`] = 1
        }

        await cafesCollection.updateOne(
          // Query
          {_id: new ObjectId(cafeID)},
          { $inc: updates }
        )
      }

      // Update overall
      await updateRatingField(cafeID, "overall", Number(overall))
      // Update drinkQuality
      await updateRatingField(cafeID, "drinkQuality", Number(drinkQuality))
      // Update vibe
      await updateRatingField(cafeID, "vibe", Number(vibe))
      // Update ammenities
      await updateRatingField(cafeID, "ammenities", Number(ammenities))
      // Update coffee
      await updateRatingField(cafeID, "coffee", Number(coffee))
      // Update matcha
      await updateRatingField(cafeID, "matcha", Number(matcha))
      // Update tea
      await updateRatingField(cafeID, "tea", Number(tea))     
      // Update specialty
      await updateRatingField(cafeID, "specialty", Number(specialty))


      // Update labels
      await incrementLabelCounts(cafeID, good, bad)

      res.status(201).json(inserted);
    } catch (error) {
      console.error("Error posting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };