const { cmd } = require("../command");

cmd(
  {
    pattern: "pinterest",
    alias: ["pin"],
    react: "📌",
    desc: "Download images from Pinterest (direct links)",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      q,
      reply,
      from,
    }
  ) => {
    try {
      if (!q) return reply("*Give me a Pinterest direct image link!* 🔗");

      if (!q.includes("pinimg.com"))
        return reply("*Only direct Pinterest image URLs are supported!* ❌");

      const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
   🎗️ *_PINTEREST_* 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 🎗️
════════════════════════   

❤️ Download pinterest image/video ❤️
🚀 Pow. By *DANUKA DISANAYAKA* 🔥
─────────────────────────
✅ *Downloaded Successfully!*
🔗 *Source*: ${q}
─────────────────────────
⚙️ Made with ❤️ By *DANUKA DISANAYAKA💫*
`;

      await robin.sendMessage(
        from,
        {
          image: { url: q },
          caption,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`*Failed to download:* ${e.message}`);
    }
  }
);
