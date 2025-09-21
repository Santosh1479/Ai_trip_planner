import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingDots from '../components/LoadingDots';

export default function TripForm({ onPlanned = () => {} }) {
  const [form, setForm] = useState({
    startDate: '2024-09-22',
    endDate: '2024-09-23',
    destination: 'Bangalore',
    startingPoint: 'Bangalore',
    travelers: 2,
    budgetStyle: 'Moderate',
    interests: 'shopping',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'travelers' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !form.startDate ||
      !form.endDate ||
      !form.destination ||
      !form.startingPoint ||
      !form.travelers ||
      !form.interests
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate dates
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    if (endDate < startDate) {
      alert('End date cannot be before start date');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/plan/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/trip/${data.id}`);
      }
    } catch (error) {
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow"
        onSubmit={handleSubmit}
      >
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? <LoadingDots /> : 'Plan Trip'}
        </button>
      </form>
    </div>
  );
}