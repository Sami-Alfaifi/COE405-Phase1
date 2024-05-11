const mongoose = require("mongoose");

mongoose
  .connect(Link[0], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

const rideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  riders: {
    type: [String],
    validate: {
      validator: function (riders) {
        return riders.length <= 4;
      },
      message: "Cannot have more than 4 riders.",
    },
  },
});

module.exports = mongoose.model("Ride", rideSchema);
