const { cmd } = require("../command");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

cmd(
{
  pattern: "firelogo",
  alias: ["firelogo", "flameLogo"],
  react: "🔥",
  desc: "Generate a fiery glowing text logo",
  category: "Logo",
  filename: __filename,
},
async (
  robin,
  mek,
  m,
  {
    from,
    quoted,
    q,
    reply,
  }
) => {
  try {
    if (!q) return reply("*Please provide text for the fire logo!* 🔥");

    reply("*Creating your fiery logo...* ⏳");

    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Dark background to enhance fire effect
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fire gradient effect
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#FF4500"); // Flame red
    gradient.addColorStop(0.5, "#FFA500"); // Orange glow
    gradient.addColorStop(1, "#FFD700"); // Yellow fire

    ctx.fillStyle = gradient;
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "#FF6347"; // Fire glow effect
    ctx.shadowBlur = 20;

    ctx.fillText(q, canvas.width / 2, canvas.height / 2);

    // Create the buffer for the image and save it
    const buffer = canvas.toBuffer("image/png");
    const logoPath = path.resolve(__dirname, "tempFireLogo.png");
    fs.writeFileSync(logoPath, buffer);

    const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
     🎨 *_FIRE LOGO GENERATOR_* 🎨  
════════════════════════   

🖋️ *Your Text*: ${q}

─────────────────────────

✅ *Logo created successfully!*
⚙️ Made with ❤️ By *DANUKA DISANAYAKA*💫
    `;

    await robin.sendMessage(
      from,
      {
        image: { url: logoPath },
        caption,
      },
      { quoted: mek }
    );

    fs.unlinkSync(logoPath);
  } catch (err) {
    console.error(err);
    reply("*An error occurred while generating the fire logo.* ❌");
  }
});
