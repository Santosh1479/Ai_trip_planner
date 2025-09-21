const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateItinerary = async ({
  startDate,
  endDate,
  destination,
  startingPoint,
  travelers,
  budgetStyle,
  interests,
}) => {
  try {
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Build prompt
    const prompt = `
Plan a detailed ${numberOfDays}-day trip itinerary for me as a journey path.

Details:
- Starting point: ${startingPoint}
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Travelers: ${travelers}
- Budget style: ${budgetStyle}
- Interests: ${interests}

Instructions:
- Structure each day as a path: start at the starting point (or previous day's end), then list each activity as a stop along the way, and end at the day's final location.
- For each activity (stop), include: name, time, description, location, approximate cost, and travel/transportation tips.
- Clearly indicate the start and end for each day.
- Suggest local food/restaurants or cultural experiences as stops.
- Balance sightseeing, relaxation, and travel time so the trip feels enjoyable, not rushed.
- IMPORTANT: Return only valid JSON in the following schema:

{
  "tripSummary": {
    "destination": "...",
    "startDate": "...",
    "endDate": "...",
    "numberOfDays": ...,
    "travelers": ...,
    "budgetStyle": "...",
    "interests": ["..."]
  },
  "days": [
    {
      "day": 1,
      "date": "...",
      "path": [
        {
          "type": "start",
          "location": "...",
          "time": "...",
          "note": "Trip begins"
        },
        {
          "type": "activity",
          "name": "...",
          "time": "...",
          "description": "...",
          "location": "...",
          "cost": "...",
          "transportationTips": "..."
        },
        // ...more activities...
        {
          "type": "end",
          "location": "...",
          "time": "...",
          "note": "Day ends"
        }
      ]
    }
  ]
}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // Remove Markdown code block wrappers (``` or ```json)
    response = response.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

    // Try parsing
    let itinerary;
    try {
      itinerary = JSON.parse(response);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", err);
      itinerary = {
        tripSummary: {
          destination,
          startDate,
          endDate,
          numberOfDays,
          travelers,
          budgetStyle,
          interests: interests.split(",").map(i => i.trim()),
        },
        days: [{
          day: 1,
          date: startDate,
          activities: [{
            name: "Default Activity",
            time: "Morning",
            description: "Unable to generate detailed itinerary. Please try again.",
            location: destination,
            cost: "N/A",
            transportationTips: "N/A"
          }]
        }]
      };
    }

    return itinerary;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate itinerary");
  }
};