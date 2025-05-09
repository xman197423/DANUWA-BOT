const { cmd } = require("../command");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

cmd(
{
  pattern: "glitchlogo",
  alias: ["glitchlogo", "digitalGlitchLogo"],
  react: "🕶️",
  desc: "Generate a glitchy digital distortion text logo",
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
    if (!q) return reply("*Please provide text for the glitch logo!* 🕶️");

    reply("*Generating your glitchy logo...* ⏳");

    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Dark background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glitch effect: random displacement of text
    ctx.font = "bold 70px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#00FF00"; // Neon green for text

    // Glitchy distortion
    for (let i = 0; i < q.length; i++) {
      const xOffset = Math.random() * 8 - 4; // Random X displacement
      const yOffset = Math.random() * 8 - 4; // Random Y displacement
      ctx.fillText(q[i], canvas.width / 2 + xOffset, canvas.height / 2 + yOffset);
    }

    // Export as buffer and save to file
    const buffer = canvas.toBuffer("image/png");
    const logoPath = path.resolve(__dirname, "tempGlitchLogo.png");
    fs.writeFileSync(logoPath, buffer);

    const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
    🎨 *_GLITCH LOGO GENERATOR_* 🎨  
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
    reply("*An error occurred while generating the glitch logo.* ❌");
  }
});
