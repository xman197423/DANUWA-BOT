const { cmd } = require("../command");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

cmd(
{
  pattern: "frostlogo",
  alias: ["frostlogo", "iceLogo"],
  react: "❄️",
  desc: "Generate a frosty text logo with cool style",
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
    if (!q) return reply("*Please provide text for the frost logo!* ❄️");

    reply("*Creating your cool frost logo...* ⌛");

    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Background: icy gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, "#002233");
    bgGradient.addColorStop(1, "#003F66");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Frosted center box (like a glass panel)
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(80, 100, canvas.width - 160, 150);

    // Add light snow/frost particles
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Set text style
    const textGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    textGradient.addColorStop(0, "#E0F8FF");
    textGradient.addColorStop(1, "#A6DFFF");
    ctx.fillStyle = textGradient;

    ctx.shadowColor = "#B3EDFF";
    ctx.shadowBlur = 20;

    ctx.font = "bold 55px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(q, canvas.width / 2, canvas.height / 2);

    // Export image
    const buffer = canvas.toBuffer("image/png");
    const logoPath = path.resolve(__dirname, "tempFrostLogo.png");
    fs.writeFileSync(logoPath, buffer);

    const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
    🎨 *_FROST LOGO GENERATOR_* 🎨  
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
    reply("*An error occurred while generating the frost logo.* ❌");
  }
});
