const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

cmd({
  pattern: "caption",
  alias: ["imagecaption", "imgdesc"],
  react: "🖼️",
  desc: "Generate a caption for a replied image using GPT-4o",
  category: "ai",
  use: ".caption (reply to an image)",
  filename: __filename
}, async (conn, m, msg, { quoted, reply }) => {
  try {
    if (!quoted || !quoted.message?.imageMessage) {
      return reply("❗ Please reply to an image.");
    }

    // Download image buffer
    const buffer = await downloadMediaMessage(quoted, "buffer", {}, {
      logger: console,
      reuploadRequest: conn.updateMediaMessage
    });

    const imageBase64 = buffer.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in a few sentences:" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const caption = response.choices[0]?.message?.content || "❌ Couldn't generate caption.";
    reply(`📝 *Image Caption:*\n\n${caption}`);
    
  } catch (err) {
    console.error("❌ GPT-4o Error:", err);
    reply("❌ Failed to generate caption. Check API key or model access.");
  }
});
