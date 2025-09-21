import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/plan/${id}`)
      .then(res => res.json())
      .then(data => {
        setTrip(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Trip Details</h2>
      <div className="mb-4">
        <strong>Destination:</strong> {trip.destination}<br />
        <strong>Dates:</strong> {trip.startDate} to {trip.endDate}<br />
        <strong>Travelers:</strong> {trip.travelers}<br />
        <strong>Budget:</strong> {trip.budgetStyle}<br />
        <strong>Interests:</strong> {trip.interests}
      </div>
      <h3 className="text-xl font-semibold mb-2">Itinerary</h3>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
        {trip.itinerary ? JSON.stringify(trip.itinerary, null, 2) : "Generating itinerary..."}
      </pre>
    </div>
  );
}