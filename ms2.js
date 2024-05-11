const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://samialfifi65:Sa1421424mI@cluster0.mrg7fta.mongodb.net/?retryWrites=true&w=majority";

const ms2 = new MongoClient(uri);

async function run() {
  const database = ms2.db("KFUber");
  const rides = database.collection("rides");

  try {
    await rides.insertOne({
      name: "yahya",
      from: "kfupm",
      to: "airport",
      date: new Date("2014-03-01T08:00:00Z"),
    });
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await ms2.close();
  }
}
run().catch(console.dir);
