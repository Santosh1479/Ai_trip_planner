import React, { useState } from 'react';
import { planTrip } from '../api';
import LoadingDots from '../components/LoadingDots';

export default function TripForm({ onPlanned }) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    destination: 'Delhi',
    startingPoint: 'Bangalore',
    travelers: 2,
    budgetStyle: 'Moderate',
    interests: 'hotels',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'travelers' ? Number(value) : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const trip = await planTrip(form);
    setLoading(false);
    onPlanned(trip);
  };

  return (
    <form className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl mb-4 font-semibold">Plan Your Trip</h2>
      <input
        className="block w-full mb-3 p-2 border rounded"
        name="startingPoint"
        placeholder="Starting Point (city/country)"
        value={form.startingPoint}
        onChange={handleChange}
        required
      />
      <input
        className="block w-full mb-3 p-2 border rounded"
        name="destination"
        placeholder="Destination"
        value={form.destination}
        onChange={handleChange}
        required
      />
      <input
        className="block w-full mb-3 p-2 border rounded"
        name="startDate"
        type="date"
        value={form.startDate}
        onChange={handleChange}
        required
      />
      <input
        className="block w-full mb-3 p-2 border rounded"
        name="endDate"
        type="date"
        value={form.endDate}
        onChange={handleChange}
        required
      />
      <input
        className="block w-full mb-3 p-2 border rounded"
        name="travelers"
        type="number"
        min="1"
        value={form.travelers}
        onChange={handleChange}
        required
      />
      <select
        className="block w-full mb-3 p-2 border rounded"
        name="budgetStyle"
        value={form.budgetStyle}
        onChange={handleChange}
        required
      >
        <option value="Backpacker">Backpacker</option>
        <option value="Moderate">Moderate</option>
        <option value="Luxury">Luxury</option>
      </select>
      <input
        className="block w-full mb-3 p-2 border rounded"
        name="interests"
        placeholder="Interests (e.g. food, history, nightlife, shopping, adventure, nature, beaches)"
        value={form.interests}
        onChange={handleChange}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>
        {loading ? <LoadingDots /> : 'Plan Trip'}
      </button>
    </form>
  );
}