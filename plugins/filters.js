const { cmd } = require("../command");
const { getRandom } = require("../lib/functions");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs").promises;
const sharp = require("sharp");
const path = require("path");

const filterOptions = [
  { name: "Grayscale", apply: img => img.grayscale() },
  { name: "Invert", apply: img => img.negate() },
  { name: "Brighten", apply: img => img.modulate({ brightness: 1.5 }) },
  { name: "Sepia", apply: img => img.tint({ r: 112, g: 66, b: 20 }) },
  { name: "Blur", apply: img => img.blur(5) },
  { name: "Emboss", apply: img => img.emboss() },
  { name: "Brightness", apply: img => img.modulate({ brightness: 2 }) },
  { name: "Saturation", apply: img => img.modulate({ saturation: 2 }) },
];

const pendingFilter = {};

// Add a delay function to prevent issues with file handles
const delay = ms => new Promise(res => setTimeout(res, ms));

// Step 1: User sends image and runs `.filters`
cmd({
  pattern: "filters",
  react: "🎛️",
  desc: "Apply filter to an image",
  category: "utilities",
  filename: __filename,
}, async (robin, mek, m, { from, sender, quoted, reply }) => {
  try {
    const isQuotedImage = quoted && quoted.type === "imageMessage";
    const isImage = m.type === "imageMessage";
    const imageMessage = isQuotedImage ? quoted : isImage ? m : null;

    if (!imageMessage) {
      return reply("🖼️ *Reply to an image or send an image with `.filters`*");
    }

    const buffer = await downloadMediaMessage(imageMessage, "buffer", {}, robin);
    if (!buffer) return reply("❌ *Failed to download image.*");

    const tempFolder = path.join(__dirname, "temp"); // Define temp folder
    await fs.mkdir(tempFolder, { recursive: true }); // Create temp folder if it doesn't exist

    const input = path.join(tempFolder, getRandom(".jpg"));
    const output = path.join(tempFolder, getRandom(".jpg"));

    // Save the image to the temp folder
    await fs.writeFile(input, buffer);

    const filterList = filterOptions.map((f, i) => `${i + 1}. ${f.name}`).join("\n");

    const sent = await robin.sendMessage(from, {
      text: `🎨 *Choose a filter to apply:*\n\n${filterList}\n\n_Reply with the number (e.g., 1)_`,
    }, { quoted: mek });

    // Store temp file and buffer for reply handler
    pendingFilter[sender] = {
      input,
      output,
      quoted: mek,
    };
  } catch (err) {
    console.error(err);
    reply("❌ *Something went wrong while processing image.*");
  }
});

// Step 2: Handle reply with filter number
cmd({
  filter: (text, { sender }) => {
    return pendingFilter[sender] && /^[1-8]$/.test(text.trim());
  },
}, async (robin, mek, m, { from, sender, body, reply }) => {
  const choice = parseInt(body.trim()) - 1;
  const { input, output, quoted } = pendingFilter[sender];
  delete pendingFilter[sender];

  const selected = filterOptions[choice];

  try {
    await selected.apply(sharp(input)).toFile(output);

    await robin.sendMessage(from, {
      image: { url: output },
      caption: `✅ *Applied Filter:* ${selected.name}`,
    }, { quoted: mek });

    await delay(500); // Give system time to release file lock

    // Attempt to delete the temp files
    try {
      await fs.unlink(input);
      await fs.unlink(output);
    } catch (unlinkErr) {
      console.warn("⚠️ Failed to delete temp files:", unlinkErr.message);
    }
  } catch (err) {
    console.error(err);
    reply("❌ *Failed to apply selected filter.*");
  }
});
