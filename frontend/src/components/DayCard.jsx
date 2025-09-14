import React from 'react';

export default function DayCard({ day }) {
  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h3 className="font-semibold mb-2">Day {day.day}</h3>
      <ul className="list-disc ml-5">
        {day.activities.map((act, idx) => (
          <li key={idx}>{act}</li>
        ))}
      </ul>
    </div>
  );
}