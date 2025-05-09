const { cmd } = require("../command");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

cmd(
{
  pattern: "rainbowlogo",
  alias: ["rainbowlogo", "colorfulLogo"],
  react: "🌈",
  desc: "Generate a colorful rainbow gradient text logo",
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
    if (!q) return reply("*Please provide text for the rainbow logo!* 🌈");

    reply("*Creating your colorful rainbow logo...* ⏳");

    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Rainbow gradient text
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#FF0000");
    gradient.addColorStop(0.2, "#FF7F00");
    gradient.addColorStop(0.4, "#FFFF00");
    gradient.addColorStop(0.6, "#00FF00");
    gradient.addColorStop(0.8, "#0000FF");
    gradient.addColorStop(1, "#8B00FF");

    ctx.fillStyle = gradient;
    ctx.font = "bold 70px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(q, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer("image/png");
    const logoPath = path.resolve(__dirname, "tempRainbowLogo.png");
    fs.writeFileSync(logoPath, buffer);

    const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
 🎨 *_RAINBOW LOGO GENERATOR_* 🎨  
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
    reply("*An error occurred while generating the rainbow logo.* ❌");
  }
});
