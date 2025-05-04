const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_DBURI;

if (!uri) {
  throw new Error("Missing MONGO_DBURI in .env file");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectToMongo = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
    return client.db("sipDB"); // Export this DB
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectToMongo;
