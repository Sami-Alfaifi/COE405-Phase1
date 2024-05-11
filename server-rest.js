const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = 3000;
var cors = require("cors");
const { ObjectId } = require("bson");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
// Serve static files from the public directory
app.use(express.static("../front/public"));

// Define a REST API route for getting the available rides
app.get("/api/rides", async (req, res) => {
  console.log("READING...");

  await fetch("https://ms2-yvaqtnmqaq-uc.a.run.app/read")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })

    .then((data) => {
      console.log(data);

      res.json(data);
    })

    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  //res.send("Hello World!");
});

app.get("/api/dists", (req, res) => {
  // Logic for getting the available dists from a database or other source
  console.log(req.body, req.params);
  const dists = ["KFUPM", "Airport", "Railway"];
  res.json(dists);
  console.log("dists");
});

// Define a REST API route for posting a new ride offer
app.post("/api/offers", async (req, res) => {
  // Extract the ride offer data from the request body
  const { name, from, to, date, riders } = await req.body;

  await fetch("https://ms1-yvaqtnmqaq-uc.a.run.app/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });

  // Add the ride to the offeredRides array
  console.log(
    `name: ${name} ,from: ${from} ,to: ${to} ,date: ${date} ,riders: ${riders}`
  );

  // Send a response indicating success
  res.status(201);
});
app.put("/api/assign", async (req, res) => {
  const { name, from, to, date, riders } = await req.body;

  console.log(
    `name: ${name} ,from: ${from} ,to: ${to} ,date: ${date} ,riders: ${riders}`
  );

  res.status(201);
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
