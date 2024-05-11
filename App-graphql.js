import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {} from "stylis-plugin-rtl";
const GET_RIDES = gql`
  query GetRides {
    rides {
      id
      name
      from
      to
      time
      riders
    }
  }
`;

const GET_DISTINATIONS = gql`
  query GetDestinations {
    dests
  }
`;

const OFFER_RIDE = gql`
  mutation OfferRide($ride: RideInput!) {
    createRide(ride: $ride) {
      id
      name
      from
      to
      time
      riders
    }
  }
`;

const ASSIGN_RIDER = gql`
  mutation AssignRider($rideId: ID!, $rider: String!) {
    assignRider(rideId: $rideId, rider: $rider) {
      id
      name
      from
      to
      time
      riders
    }
  }
`;

function App() {
  const [name, setName] = useState("");
  const [rider, setRider] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");

  const {
    loading: ridesLoading,
    error: ridesError,
    data: ridesData,
  } = useQuery(GET_RIDES);
  const {
    loading: destLoading,
    error: destError,
    data: destData,
  } = useQuery(GET_DISTINATIONS);

  const [offerRide] = useMutation(OFFER_RIDE, {
    update(cache, { data: { createRide } }) {
      cache.modify({
        fields: {
          rides(existingRides = []) {
            const newRideRef = cache.writeFragment({
              data: createRide,
              fragment: gql`
                fragment NewRide on Ride {
                  id
                  name
                  from
                  to
                  time
                  riders
                }
              `,
            });
            return [...existingRides, newRideRef];
          },
        },
      });
    },
  });

  const [assignRider] = useMutation(ASSIGN_RIDER, {
    update(cache, { data: { assignRider } }) {
      cache.modify({
        fields: {
          rides(existingRides = [], { readField }) {
            const rideIndex = existingRides.findIndex(
              (ride) => readField("id", ride) === assignRider.id
            );
            if (rideIndex !== -1) {
              const newRideRef = cache.writeFragment({
                data: assignRider,
                fragment: gql`
                  fragment UpdatedRide on Ride {
                    id
                    name
                    from
                    to
                    time
                    riders
                  }
                `,
              });
              return [
                ...existingRides.slice(0, rideIndex),
                newRideRef,
                ...existingRides.slice(rideIndex + 1),
              ];
            }
            return existingRides;
          },
        },
      });
    },
  });

  const handleOfferRide = () => {
    offerRide({
      variables: {
        ride: {
          name: name,
          from: from,
          to: to,
          time: time,
          riders: [],
        },
      },
      optimisticResponse: {
        __typename: "Mutation",
        createRide: {
          __typename: "Ride",
          id: -1,
          name: name,
          from: from,
          to: to,
          time: time,
          riders: [],
        },
      },
    });
    setName("");
    setFrom("");
    setTo("");
    setTime("");
  };

  const handleAssignRider = (rideId) => {
    assignRider({
      variables: {
        rideId: rideId,
        rider: rider,
      },
      optimisticResponse: {
        __typename: "Mutation",
        assignRider: {
          __typename: "Ride",
          id: rideId,
          name: ridesData.rides.find((ride) => ride.id === rideId).name,
          from: ridesData.rides.find((ride) => ride.id === rideId).from,
          to: ridesData.rides.find((ride) => ride.id === rideId).to,
          time: ridesData.rides.find((ride) => ride.id === rideId).time,
          riders: [
            ...ridesData.rides.find((ride) => ride.id === rideId).riders,
            rider,
          ],
        },
      },
    });
    setRider("");
  };

  if (ridesLoading || destLoading) return <p>Loading...</p>;
  if (ridesError) return <p>Error fetching rides.</p>;
  if (destError) return <p>Error fetching destinations.</p>;

  return (
    <div>
      <h1>Ride Sharing App</h1>
      <h2>Offer a Ride</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="from">From:</label>
        <select
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          <option value="">Select a location</option>
          {destData.dests.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
        <label htmlFor="to">To:</label>
        <select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Select a location</option>
          {destData.dests.map((dest) => (
            <option key={dest.name} value={dest.locations}>
              {dest}
            </option>
          ))}
        </select>
        <label htmlFor="time">Time:</label>
        <input
          type="datetime-local"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={handleOfferRide}>Offer Ride</button>
      </form>
      <h2>Rides Offered</h2>
      {ridesData.rides.length === 0 ? (
        <p>No rides offered yet.</p>
      ) : (
        <ul>
          {ridesData.rides.map((ride) => (
            <li key={ride.id}>
              <p>
                <strong>{ride.name}</strong>
              </p>
              <p>From: {ride.from}</p>
              <p>To: {ride.to}</p>
              <p>Time: {new Date(ride.time).toLocaleString()}</p>
              {ride.riders.length === 0 ? (
                <p>No riders yet.</p>
              ) : (
                <ul>
                  {ride.riders.map((rider) => (
                    <li key={rider}>{rider}</li>
                  ))}
                </ul>
              )}
              <label htmlFor={`rider-${ride.id}`}>Assign Rider:</label>
              <select
                id={`rider-${ride.id}`}
                value={rider}
                onChange={(e) => setRider(e.target.value)}
              >
                <option value="">Select a rider</option>
                {ride.riders.length === 0 ? (
                  <option value={name}>{name}</option>
                ) : (
                  <option value={name} disabled={ride.riders.includes(name)}>
                    {name} (me)
                  </option>
                )}
                {ridesData.rides
                  .filter((r) => r.id !== ride.id)
                  .flatMap((r) => r.riders)
                  .filter((r, i, a) => a.indexOf(r) === i)
                  .map((rider) => (
                    <option
                      key={rider}
                      value={rider}
                      disabled={ride.riders.includes(rider)}
                    >
                      {rider}
                    </option>
                  ))}
              </select>
              <button onClick={() => handleAssignRider(ride.id)}>Assign</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default App;
