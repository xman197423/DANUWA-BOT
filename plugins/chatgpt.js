const { cmd } = require('../command');
const OpenAI = require('openai');
const config = require('../config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY, // Add your OpenAI API key in config.js
});

cmd({
  pattern: "chatgpt",
  alias: ["chat", "gpt", "ask"],
  react: "💬",
  desc: "Chat with OpenAI's ChatGPT",
  category: "ai",
  use: ".chatgpt <your question>",
  filename: __filename,
}, async (conn, mek, msg, { reply, args }) => {
  try {
    const prompt = args.join(" ");
    if (!prompt) return reply("❗ Please ask a question.\nUsage: .chatgpt <your question>");

    // ChatGPT request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    const answer = completion.choices[0].message.content.trim();
    reply(`💬 ${answer}`);
  } catch (error) {
    console.error("ChatGPT error:", error);
    reply("❌ Error communicating with ChatGPT.");
  }
});
