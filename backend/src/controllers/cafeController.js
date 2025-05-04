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
