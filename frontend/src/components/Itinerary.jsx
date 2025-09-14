import React from 'react';
import DayCard from './DayCard';

export default function Itinerary({ trip, onBack }) {
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <button className="mb-4 text-blue-600 underline" onClick={onBack}>← Back</button>
      <h2 className="text-2xl font-bold mb-4">
        {trip.destination} ({trip.startDate} - {trip.endDate})
      </h2>
      {itinerary.length === 0 ? (
        <div className="text-red-600">No itinerary found. Please try again.</div>
      ) : (
        <div className="space-y-4">
          {itinerary.map((day, idx) => (
            <DayCard key={idx} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}