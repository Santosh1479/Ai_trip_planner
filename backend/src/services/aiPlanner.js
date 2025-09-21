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
Plan a detailed ${numberOfDays}-day trip itinerary for me.

Details:
- Starting point: ${startingPoint}
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Travelers: ${travelers}
- Budget style: ${budgetStyle}
- Interests: ${interests}

Instructions:
- Create a day-by-day plan with at least 3 activities per day (morning, afternoon, evening).
- Each activity should include: name, time, description, location, approximate cost, and travel/transportation tips.
- Suggest local food/restaurants or cultural experiences each day.
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
      "activities": [
        {
          "name": "...",
          "time": "...",
          "description": "...",
          "location": "...",
          "cost": "...",
          "transportationTips": "..."
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