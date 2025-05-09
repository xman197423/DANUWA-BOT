const { cmd } = require("../command");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

cmd(
{
  pattern: "graffitilogo",
  alias: ["graffitilogo", "streetLogo"],
  react: "🎨",
  desc: "Generate a graffiti-style logo with paint splatter",
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
    if (!q) return reply("*Please provide text for the graffiti logo!* 🎨");

    reply("*Spraying your graffiti logo...* ⏳");

    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Graffiti style background with spray-paint splatter
    ctx.fillStyle = "#2E2E2E"; // Dark street background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paint splatter (random paint drops)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 3 + 1;
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Graffiti text effect with street style
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFD700"; // Golden spray effect

    ctx.fillText(q, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer("image/png");
    const logoPath = path.resolve(__dirname, "tempGraffitiLogo.png");
    fs.writeFileSync(logoPath, buffer);

    const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
  🎨 *_GRAFFITI LOGO GENERATOR_* 🎨  
════════════════════════   

🖋️ *Your Text*: ${q}

─────────────────────────

✅ *Logo created successfully!*
⚙️ Made with ❤️ By *DANUKA DISANAYAKA*💫
─────────────────────────
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
    reply("*An error occurred while generating the graffiti logo.* ❌");
  }
});
