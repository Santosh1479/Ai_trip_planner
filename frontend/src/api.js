const API_URL = 'http://localhost:5000/plan';

export const planTrip = async (tripData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData)
  });
  return res.json();
};