const { cmd } = require("../command");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

// Register custom font
registerFont('./fonts/Sans BOLD.ttf', { family: 'Sans' });

cmd(
  {
    pattern: "animelogo",
    alias: ["logomaker", "createLogo"],
    react: "🎨",
    desc: "Generate a custom anime neon logo from text",
    category: "Logo",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, q, reply }) => {
    try {
      if (!q) return reply("*Please provide text for the logo!* ✏️");
      reply("*Creating your anime neon logo...* ⌛");

      // Load base image
      const baseImage = await loadImage(path.resolve(__dirname, "empty_box_anime_logo.png"));

      // Create canvas from image size
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw base image
      ctx.drawImage(baseImage, 0, 0);

      // Set initial font and style
      let fontSize = 150;
      ctx.font = `${fontSize}px "Sans"`;
      ctx.fillStyle = "#00FF66";
      ctx.shadowColor = "#00FF66";
      ctx.shadowBlur = 20;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Reduce font size until text fits in box
      while (ctx.measureText(q).width > 600 && fontSize > 10) {
        fontSize -= 2;
        ctx.font = `${fontSize}px "Sans"`;
      }

      // Center coordinates inside the glowing box (tweak if needed)
      const textX = 435; // Adjusted center X of the glowing box
      const textY = 470; // Adjusted center Y

      // Draw text
      ctx.fillText(q, textX, textY);

      // Save output
      const buffer = canvas.toBuffer("image/png");
      const outputPath = path.resolve(__dirname, "tempLogo.png");
      fs.writeFileSync(outputPath, buffer);

      // Formatted caption
      const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
    🎨 *_ANIME LOGO GENERATOR_* 🎨  
════════════════════════   

🖋️ *Your Text*: ${q}

─────────────────────────

✅ *Logo created successfully!*
⚙️ Made with ❤️ By *DANUKA DISANAYAKA💫*
`;

      // Send image
      await robin.sendMessage(
        from,
        {
          image: { url: outputPath },
          caption,
        },
        { quoted: mek }
      );

      // Clean up
      fs.unlinkSync(outputPath);

    } catch (err) {
      console.error(err);
      reply("*An error occurred while generating the logo.* ❌");
    }
  }
);
