import Feedback from "../models/Feedback.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

dotenv.config();

async function fetchWeather(destination) {
  try {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`
    );
    const geoData = await geo.json();
    if (!geoData.results?.length) return "Weather data unavailable";
    const { latitude, longitude } = geoData.results[0];
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7&timezone=auto`
    );
    const wData = await weather.json();
    const c = wData.current;
    return `Current: ${c.temperature_2m}°C, wind ${c.windspeed_10m}km/h. 7-day avg max: ${(wData.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / 7).toFixed(1)}°C, avg min: ${(wData.daily.temperature_2m_min.reduce((a, b) => a + b, 0) / 7).toFixed(1)}°C, total rain: ${wData.daily.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)}mm`;
  } catch {
    return "Weather data unavailable";
  }
}

async function fetchNews(destination) {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(destination + " travel")}&lang=en&max=3&apikey=free`
    );
    if (!res.ok) return "News data unavailable";
    const data = await res.json();
    return data.articles?.map((a) => a.title).join("; ") || "No recent news";
  } catch {
    return "News data unavailable";
  }
}

export const generatePackingList = async (req, res) => {
  const { destination, duration, tripType, weather, budget, numberOfPeople, activities } = req.body;
  const apiKey = process.env.GEMINI_API;

  if (!destination || !duration) {
    return res.status(400).json({ error: "Destination and duration are required." });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "API configuration error" });
  }

  try {
    const [weatherData, newsData, feedbacks] = await Promise.all([
      fetchWeather(destination),
      fetchNews(destination),
      Feedback.find({ destination: { $regex: destination, $options: "i" } }).limit(5),
    ]);

    const eventData = feedbacks.length > 0
      ? feedbacks.map((f) => `- ${f.experience}`).join("\n")
      : "No traveler feedback available.";

    const prompt = `You are an intelligent AI-powered travel assistant.

Generate a complete travel planning response for a user with the following details:
Destination: ${destination}
Duration: ${duration}
Trip Type: ${tripType || "General"}
Weather: ${weather || weatherData}
Budget: ${budget || "Medium"}
Number of People: ${numberOfPeople || 1}
Activities Planned: ${activities || "General sightseeing"}

Your response must include the following sections in clean JSON format:

1. packingList (categorized): clothes, toiletries, electronics, essentials, accessories
2. weatherSuggestions: items to add/adjust based on weather
3. outfitPlanner: array of day objects with day, topWear, bottomWear, footwear, accessories
4. budgetRecommendations: mustHave (array), optional (array), budgetTips (array)
5. dontForgetAlerts: array of {item, reason}
6. groupPacking (if numberOfPeople > 1): sharedItems (array), personalItems (array), responsibilities (array of {person, items})
7. travelInsights: summary, alerts (array), advice (array) — based on weatherData: "${weatherData}", newsData: "${newsData}", eventData: "${eventData}"
8. smartTravelAdvice: whatToExpect (array), carryExtra (array), precautions (array)

IMPORTANT: Return ONLY valid JSON. No markdown, no extra text outside JSON.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    // Fallback chain: try models in order until one succeeds
    const MODEL_CHAIN = [
      "gemini-2.5-flash",       // free tier: 10 RPM, 250 RPD
      "gemini-2.5-flash-lite",  // free tier: 15 RPM, 1000 RPD (highest limits)
      "gemini-2.5-pro",         // free tier: 5 RPM, 100 RPD
      "gemini-2.0-flash",       // fallback
      "gemini-1.5-flash",       // fallback
    ];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    let text;
    let lastError;
    for (const modelName of MODEL_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        break;
      } catch (err) {
        lastError = err;
        if (err?.status === 429) {
          console.warn(`${modelName} quota exhausted, trying next model...`);
          // Small delay before trying next model
          await sleep(1000);
          continue;
        }
        throw err;
      }
    }

    if (!text) throw lastError;

    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
    res.json({ output: JSON.parse(text) });
  } catch (error) {
    if (error?.status === 429) {
      const retryDetail = error.errorDetails?.find((d) => d["@type"]?.includes("RetryInfo"));
      const retryAfter = retryDetail?.retryDelay ? parseInt(retryDetail.retryDelay) + 2 : 60;
      console.error("All Gemini models rate limited. Free tier quota exhausted.");
      return res.status(429).json({
        error: "AI service is temporarily unavailable due to rate limits. Please try again in a minute.",
        retryAfter,
      });
    }
    console.error("Error generating travel plan:", error.message || error);
    res.status(500).json({ error: "Failed to generate travel plan." });
  }
};