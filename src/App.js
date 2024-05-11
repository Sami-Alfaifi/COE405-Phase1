import React, { useState } from 'react';

function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [time, setTime] = useState('');
  const [offeredRides, setOfferedRides] = useState([]);

  const startingPoints = ['KFUPM', 'Railway', 'Airport'];
  const endingPoints = start === 'KFUPM' ? ['Railway', 'Airport'] : ['KFUPM'];

  const displayStartingPoints = () => {
    const options = startingPoints.map((point) => (
      <option key={point} value={point}>
        {point}
      </option>
    ));
    return (
      <select value={start} onChange={(e) => setStart(e.target.value)}>
        <option value="">Select Starting Point</option>
        {options}
      </select>
    );
  };

  const displayEndingPoints = () => {
    const options = endingPoints.map((point) => (
      <option key={point} value={point}>
        {point}
      </option>
    ));
    return (
      <select value={end} onChange={(e) => setEnd(e.target.value)}>
        <option value="">Select Ending Point</option>
        {options}
      </select>
    );
  };

  const offerRide = () => {
    if (start && end && time) {
      const newRide = { start: start, end: end, time: time, riders: [] };
      setOfferedRides([...offeredRides, newRide]);
      setStart('');
      setEnd('');
      setTime('');
    }
  };

  const assignRider = (index, rider) => {
    const updatedRides = [...offeredRides];
    updatedRides[index].riders = [...updatedRides[index].riders, rider];
    setOfferedRides(updatedRides);
  };

  const displayOfferedRides = () => {
    return offeredRides.map((ride, index) => (
      <div key={index}>
        <p>Start: {ride.start}</p>
        <p>End: {ride.end}</p>
        <p>Time: {ride.time}</p>
        <p>Riders: {ride.riders.join(', ') || 'None'}</p>
        <button
          disabled={ride.riders.includes('You')}
          onClick={() => assignRider(index, 'You')}
        >
          Assign Yourself
        </button>
      </div>
    ));
  };

  return (
    <div>
      <div>
        {displayStartingPoints()}
        {displayEndingPoints()}
        <input
          type="time"
          id="time-input"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
