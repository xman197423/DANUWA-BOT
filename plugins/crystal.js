const { cmd } = require("../command");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

cmd(
{
  pattern: "crystallogo",
  alias: ["crystallogo", "glassyLogo"],
  react: "💎",
  desc: "Generate a crystal-like, sharp text logo",
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
    if (!q) return reply("*Please provide text for the crystal logo!* 💎");

    reply("*Creating your crystal-clear logo...* ⏳");

    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Crystal-like background (subtle, frosty look)
    ctx.fillStyle = "#E0F7FA"; // Light cyan background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Crystal text effect with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#A5D6A7");
    gradient.addColorStop(0.5, "#66BB6A");
    gradient.addColorStop(1, "#388E3C");

    ctx.fillStyle = gradient;
    ctx.font = "bold 70px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "#004D40"; // Glassy shadow effect
    ctx.shadowBlur = 20;

    ctx.fillText(q, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer("image/png");
    const logoPath = path.resolve(__dirname, "tempCrystalLogo.png");
    fs.writeFileSync(logoPath, buffer);

    const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
  🎨 *_CRYSTAL LOGO GENERATOR_* 🎨  
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
    reply("*An error occurred while generating the crystal logo.* ❌");
  }
});
