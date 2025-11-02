import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/plan/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Gemini itinerary output:", data);
        setTrip(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-10">Loading your trip details...</div>
    );
  if (!trip) return <div className="text-center mt-10">Trip not found.</div>;

  // Normalize data from Gemini
  const tripData = trip.tripSummary ? trip : trip[0] || trip;
  const days =
    tripData.days || (tripData.itinerary && tripData.itinerary[0]?.days) || [];

  const getDayPath = (day) =>
    day.path || day.activities?.map((a) => ({ ...a, type: "activity" })) || [];

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Trip Details</h2>
      <div className="mb-6">
        <strong>Destination:</strong>{" "}
        {tripData.tripSummary?.destination || tripData.destination}
        <br />
        <strong>Dates:</strong>{" "}
        {tripData.tripSummary?.startDate || tripData.startDate} to{" "}
        {tripData.tripSummary?.endDate || tripData.endDate}
        <br />
        <strong>Travelers:</strong>{" "}
        {tripData.tripSummary?.travelers || tripData.travelers}
        <br />
        <strong>Budget:</strong>{" "}
        {tripData.tripSummary?.budgetStyle || tripData.budgetStyle}
        <br />
        <strong>Interests:</strong>{" "}
        {(tripData.tripSummary?.interests &&
          tripData.tripSummary.interests.join(", ")) ||
          (Array.isArray(tripData.interests)
            ? tripData.interests.join(", ")
            : tripData.interests)}
      </div>

      <h3 className="text-xl font-semibold mb-6 text-green-700">
        Itinerary Path
      </h3>

      {/* ✈️ Book Flights Button before trip starts */}
      {tripData.tripSummary?.startingPoint &&
        tripData.tripSummary?.destination &&
        tripData.tripSummary.startingPoint !==
          tripData.tripSummary.destination && (
          <a
            href={`https://www.amadeus.com/en/flights?origin=${encodeURIComponent(
              tripData.tripSummary.startingPoint
            )}&destination=${encodeURIComponent(
              tripData.tripSummary.destination
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 inline-block"
          >
            ✈️ Book Flights
          </a>
        )}

      {days.length > 0 ? (
        days.map((day, idx) => (
          <div key={idx} className="mb-12">
            <div className="font-bold text-lg mb-4 text-purple-700">
              Day {day.day}: {day.date}
            </div>

            {/* Horizontal pathway */}
            <div className="overflow-x-auto">
              <div className="flex items-start gap-12 min-w-max relative">
                {getDayPath(day).map((step, i) => (
                  <div key={i} className="flex flex-col items-center relative">
                    {/* Circle node */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full 
                        ${
                          step.type === "start"
                            ? "bg-green-500"
                            : step.type === "end"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }
                        text-white font-bold z-10`}
                    >
                      {step.type === "start"
                        ? "S"
                        : step.type === "end"
                        ? "E"
                        : i}
                    </div>

                    {/* Connector line */}
                    {i < getDayPath(day).length - 1 && (
                      <div className="absolute top-5 left-1/2 h-1 w-32 bg-gray-300 z-0"></div>
                    )}

                    {/* Info */}
                    <div className="mt-4 text-center max-w-xs">
                      {step.type === "start" && (
                        <div>
                          <span className="font-semibold text-green-600">
                            Start:
                          </span>{" "}
                          {step.location}
                          <div className="text-xs text-gray-500">
                            {step.time}
                          </div>
                          {step.note && (
                            <div className="text-xs text-gray-400">
                              {step.note}
                            </div>
                          )}
                        </div>
                      )}
                      {step.type === "activity" && (
                        <div>
                          <span className="font-semibold">{step.name}</span>
                          <div className="text-xs text-gray-500">
                            {step.time}
                          </div>
                          <div className="text-xs">{step.description}</div>
                          {step.location && (
                            <div className="text-xs text-gray-600">
                              📍 {step.location}
                            </div>
                          )}
                          {step.cost && (
                            <div className="text-xs text-gray-600">
                              💰 {step.cost}
                            </div>
                          )}
                          {step.transportationTips && (
                            <div className="text-xs text-gray-600">
                              🚖 {step.transportationTips}
                            </div>
                          )}
                        </div>
                      )}
                      {step.type === "end" && (
                        <div>
                          <span className="font-semibold text-red-600">
                            End:
                          </span>{" "}
                          {step.location}
                          <div className="text-xs text-gray-500">
                            {step.time}
                          </div>
                          {step.note && (
                            <div className="text-xs text-gray-400">
                              {step.note}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🏨 Book Hotels Button after each day */}
            {getDayPath(day).length > 0 && (
              <div className="mt-4">
                {(() => {
                  const firstLocationStep = getDayPath(day).find(
                    (step) => step.location
                  );
                  const hotelCity =
                    firstLocationStep?.location?.split(",")[0].trim() || // take city only
                    tripData.tripSummary?.destination?.split(",")[0].trim() ||
                    "";
                  return (
                    <a
                      href="https://www.amadeus.com/en/hotels"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-3 inline-block"
                    >
                      🏨 Book Hotels
                    </a>
                  );
                })()}
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No itinerary available.</div>
      )}

      {/* Debug section */}
      <div className="mt-8">
        <h4 className="font-semibold mb-2">Gemini Raw Output:</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(tripData, null, 2)}
        </pre>
        <div className="text-xs text-gray-500 mt-1">
          (See browser console for raw Gemini output)
        </div>
      </div>
    </div>
  );
}
