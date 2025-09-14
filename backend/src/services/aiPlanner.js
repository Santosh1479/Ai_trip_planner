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
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Build prompt
//   const prompt = `
// Plan a detailed ${numberOfDays}-day trip itinerary for me.

// Details:
// - Starting point: ${startingPoint}
// - Destination: ${destination}
// - Dates: ${startDate} to ${endDate}
// - Travelers: ${travelers}
// - Budget style: ${budgetStyle}
// - Interests: ${interests}

// Instructions:
// - Create a day-by-day plan with at least 3 activities per day (morning, afternoon, evening).
// - Include activity name, time, description, location, approximate cost, and any travel/transportation tips.
// - Suggest local food/restaurants or cultural experiences each day.
// - Balance sightseeing, relaxation, and travel time so the trip feels enjoyable, not rushed.
// - Return the plan in structured JSON format.

// `;

const prompt = `
Plan a detailed 3-day trip itinerary for me.
Details:
- Starting point: Bangalore
- Destination: Delhi
- Dates: 2025-09-10 to 2025-09-12
- Travelers: 2
- Budget style: Moderate
- Interests: hotels

Instructions:
- Create a day-by-day plan with at least 3 activities per day (morning, afternoon, evening).
- Include activity name, time, description, location, approximate cost, and any travel/transportation tips.
- Suggest local food/restaurants or cultural experiences each day.
- Balance sightseeing, relaxation, and travel time so the trip feels enjoyable, not rushed.
- Return the plan in structured JSON format.
`;
  console.log("Gemini prompt:", prompt);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  try {
    const response = result.response.text();
    console.log("Gemini raw response:", response);
    
  } catch (error) {
    console.error("Error getting Gemini response text:", error);
  }

  // Parse JSON from Gemini response
  try {
    // Try to extract JSON from a code block first
    let jsonText = response;
    const codeBlockMatch = response.match(/```json([\s\S]*?)```/i);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    } else {
      // Fallback: extract first {...} or [...]
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) jsonText = jsonMatch[0];
    }
    const itinerary = JSON.parse(jsonText);
    return itinerary;
  } catch (err) {
    console.error("Gemini response:", response);
    throw new Error("Failed to parse Gemini response as JSON");
  }
};