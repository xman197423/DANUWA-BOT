const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const GEMINI_API_KEY = config.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

cmd({
  pattern: "sentiment",
  alias: ["sentimentanalysis", "mood"],
  react: "🔍",
  desc: "Analyze the sentiment of a given text.",
  category: "ai",
  use: ".sentiment <text>",
  filename: __filename,
}, async (conn, mek, msg, { reply, args, pushname }) => {
  try {
    const text = args.join(" ");
    if (!text) return reply("❗ Please provide the text to analyze sentiment.\nUsage: .sentiment <text>");

    const prompt = `You are a helpful assistant that analyzes the sentiment of a text. Determine if the sentiment is Positive, Negative, or Neutral and explain briefly why.\n\nText: ${text}`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return reply("❌ Failed to get sentiment analysis from AI.");
    }

    const sentimentResult = response.data.candidates[0].content.parts[0].text.trim();
    reply(`🔍 Sentiment Analysis:\n${sentimentResult}`);
  } catch (error) {
    console.error("Sentiment analysis error:", error.response?.data || error.message);
    reply("❌ Error occurred while analyzing sentiment. Please try again.");
  }
});
