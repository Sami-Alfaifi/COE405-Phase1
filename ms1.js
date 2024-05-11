async function run() {
  const Ride = await require("./mongoose"); // import the Mongoose model

  // retrieve all documents from the collection

  await Ride.find().then({ name: "sami" }, (err, rides) => {
    if (err) {
      console.error("Error retrieving rides:", err);
      return;
    }
    console.log("Retrieved rides:", rides);
  });
}
run().catch(console.dir);
// async function run() {
//   const database = ms1.db("KFUber");
//   const rides = database.collection("Rides");

//   try {
//     const findQuery = { name: { $ne: "" } };
//     const ride = await rides.find(findQuery).toArray();

//     console.log(ride);
//   } catch (err) {
//     console.error(
//       `Something went wrong trying to find the documents: ${err}\n`
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await ms1.close();
//   }
// }
// run().catch(console.dir);
