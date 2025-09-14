
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TripForm from './components/TripForm';
import Itinerary from './components/Itinerary';

export default function App() {
  const [trip, setTrip] = useState(null);

  return (
    <div>
      <Navbar />
      {!trip ? (
        <TripForm onPlanned={setTrip} />
      ) : (
        <Itinerary trip={trip} onBack={() => setTrip(null)} />
      )}
    </div>
  );
}