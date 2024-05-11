const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { ObjectId } = require("bson");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS

// Define a schema
const schema = buildSchema(`
  type Ride {
    id: String!
    name: String!
    from: String!
    to: String!
    time: String!
    riders: [String!]!
  }

  type Query {
    rides: [Ride!]!
    dests: [String!]!
  }

  type Mutation {
    createRide(name: String!, from: String!, to: String!, time: String!, riders: [String!] = []): Ride
    assignRiders(id: String!, riders: [String!]!): Ride
  }
`);

// Define resolver functions for the schema
const rides = [
  {
    id: new ObjectId(),
    name: "sami",
    from: "KFUPM",
    to: "Railway Station",
    time: "2022-06-01T08:00:00",
    riders: ["1", "2"],
  },
  {
    id: new ObjectId(),
    name: "abdulaziz",
    from: "Airport",
    to: "KFUPM",
    time: "2022-06-02T10:30:00",
    riders: [],
  },
  {
    id: new ObjectId(),
    name: "xxx",
    from: "Railway Station",
    to: "Airport",
    time: "2022-06-03T12:15:00",
    riders: ["1", "2", "3"],
  },
];

const dests = ["KFUPM", "Airport", "Railway"];

const root = {
  rides: () => rides.map((ride) => ({ ...ride, id: ride.id.toHexString() })),
  dests: () => dests,
  createRide: ({ name, from, to, time, riders }) => {
    const newRide = {
      id: new ObjectId(),
      name,
      from,
      to,
      time,
      riders,
    };
    rides.push(newRide);
    return newRide;
  },
  assignRiders: ({ id, riders }) => {
    const ride = rides.find((ride) => ride.id.toHexString() === id);
    if (!ride) {
      throw new Error("Ride not found");
    }
    ride.riders = riders;
    return ride;
  },
};

// Use the express-graphql middleware to handle GraphQL requests
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`);
});
