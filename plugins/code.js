const { cmd } = require('../command');
const OpenAI = require("openai");
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

cmd({
  pattern: "code",
  alias: ["snippet", "codesnippet"],
  react: "🧠",
  desc: "Get a code snippet from AI",
  category: "ai",
  use: ".code <your request>",
  filename: __filename,
}, async (conn, mek, msg, { args, reply }) => {
  const prompt = args.join(" ");
  if (!prompt) return reply("❗ Please provide a code request");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You're a helpful coding assistant. Return only code with comments if needed.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;
    reply("🧩 Here's your code snippet:\n\n" + result);
  } catch (err) {
    console.error(err);
    reply("❌ Failed to get code snippet.");
  }
});
