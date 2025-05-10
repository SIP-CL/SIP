const { ObjectId } = require('mongodb');

let cafesCollection;

exports.setCafeCollection = (db) => {
  cafesCollection = db.collection("cafes");
};

exports.getAll = async (req, res) => {
  try {
    const cafes = await cafesCollection.find({}).toArray();
    res.json(cafes);
  } catch (err) {
    console.error("Failed to fetch cafes:", err);
    res.status(500).send("Server error");
  }
};

exports.getByName = async (req, res) => {
  const cafeName = req.params.name;

  try {
    const cafe = await cafesCollection.findOne({ name: cafeName });

    if (!cafe) {
      return res.status(404).send("Cafe not found");
    }

    res.json(cafe);
  } catch (err) {
    console.error("Failed to fetch cafe by name:", err);
    res.status(500).send("Server error");
  }
};

exports.searchCafes = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Missing search query" });
  }

  try {
    const cafes = await cafesCollection.find({
      name: { $regex: name, $options: 'i' } // case-insensitive match
    }).toArray();

    res.json(cafes);
  } catch (err) {
    console.error("Error searching cafes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getByID = async (req, res) => {
  const cafeID = req.params.cafeID;

  try {
    const cafe = await cafesCollection.findOne({ _id: new ObjectId(cafeID) });

    if (!cafe) {
      return res.status(404).send("Cafe not found");
    }

    res.json(cafe);
  } catch (err) {
    console.error("Failed to fetch cafe by ID:", err);
    res.status(500).send("Server error");
  }
}