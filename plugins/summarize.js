const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const GEMINI_API_KEY = config.GEMINI_API_KEY;  // Your Gemini API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

cmd({
  pattern: "summarize",
  alias: ["summary"],
  react: "📝",
  desc: "Summarize the given text using Google Gemini AI.",
  category: "ai",
  use: ".summarize <text to summarize>",
  filename: __filename,
}, async (conn, mek, msg, { reply, args, pushname }) => {
  try {
    const text = args.join(" ");
    if (!text) return reply("❗ Please provide the text to summarize.\nUsage: .summarize <text>");

    const prompt = `You are a helpful assistant that summarizes text clearly and concisely. Summarize the following text:\n\n${text}`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return reply("❌ Failed to get summary from AI.");
    }

    const summary = response.data.candidates[0].content.parts[0].text.trim();
    reply(`📝 Summary:\n${summary}`);
  } catch (error) {
    console.error("Summarize error:", error.response?.data || error.message);
    reply("❌ Error occurred while summarizing. Please try again.");
  }
});
