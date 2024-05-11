import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [rider, setRider] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setdate] = useState("");

  //calling the api for distinations
  const [offeredRides, setofferedRides] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/rides")
      .then((res) => res.json())
      .then((json_obj) => setofferedRides(json_obj))
      .catch((err) => console.error(err));
  }, []);
  //calling the api for distinations
  const [FromingPoints, setFromingPoints] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/dists")
      .then((res) => res.json())
      .then((json_obj) => setFromingPoints(json_obj))
      .catch((err) => console.error(err));
  }, []);
  const toingPoints =
    from === "" ? [] : from === "KFUPM" ? ["Railway", "Airport"] : ["KFUPM"];

  const displayFromingPoints = () => {
    const options = FromingPoints.map((point) => (
      <option key={point} value={point}>
        {point}
      </option>
    ));

    return (
      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="">Select Froming Point</option>
        {options}
      </select>
    );
  };

  const displaytoingPoints = () => {
    const options = toingPoints.map((point) => (
      <option key={point} value={point}>
        {point}
      </option>
    ));
    return (
      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="">Select toing Point</option>
        {options}
      </select>
    );
  };

  const offerRide = async () => {
    if (name && from && to && date) {
      const newRide = {
        name: name,
        from: from,
        to: to,
        date: date,
        riders: [],
      };
      const response = await fetch("http://localhost:3000/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRide),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const ride = await response.json();
      console.log("Ride offer created successfully:", ride);

      setofferedRides([...offeredRides, newRide]);
      setName("");
      setFrom("");
      setTo("");
      setdate("");
    }
  };

  const assignRider = async (ride) => {
    const newRide = {
      id: ride.id,
      name: ride.name,
      from: ride.from,
      to: ride.to,
      date: ride.date,
      riders: [ride.riders, rider],
    };
    const response = await fetch("http://localhost:3000/api/assgin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRide),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  };

  const displayOfferedRides = () => {
    return offeredRides.map((ride, index) => (
      <div key={index}>
        <p>Name: {ride.name}</p>
        <p>from: {ride.from}</p>
        <p>to: {ride.to}</p>
        <p>date: {ride.date}</p>
        <p>Riders: {ride.riders}</p>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setRider(e.target.value)}
          />
          <button onClick={assignRider(ride)}>Book</button>
        </label>
      </div>
    ));
  };

  return (
    <div>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {displayFromingPoints()}
        {displaytoingPoints()}
        <input
          type="date"
          id="date-input"
          value={date}
          onChange={(e) => setdate(e.target.value)}
        />
        <button onClick={offerRide}>Offer Ride</button>
      </div>
      <div>
        <h2>Available Rides</h2>
        {offeredRides.length > 0 ? (
          displayOfferedRides()
        ) : (
          <p>No rides currently offered.</p>
        )}
      </div>
    </div>
  );
}

export default App;
