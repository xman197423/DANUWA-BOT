const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "apk",
    alias: [],
    react: "📦",
    desc: "Download your favourite apk",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { q, reply, from }
  ) => {
    try {
      if (!q) return reply("❌ *Please provide an app name to search!*");

      await robin.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
      const { data } = await axios.get(apiUrl);

      if (!data?.datalist?.list?.length) {
        return reply("⚠️ *No apps found with the given name.*");
      }

      const app = data.datalist.list[0];
      const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

      const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
       🎗️ *_APK_* 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 🎗️
════════════════════════   

❤️ Download your favourite apk ❤️
🚀 Pow. By *DANUKA DISANAYAKA* 🔥
─────────────────────────
📱 *Name:* ${app.name}
📦 *Size:* ${appSize} MB
📦 *Package:* ${app.package}
🕒 *Updated:* ${app.updated}
👤 *Developer:* ${app.developer.name}
─────────────────────────
⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*
      `.trim();

      await robin.sendMessage(
        from,
        {
          document: { url: app.file.path_alt },
          fileName: `${app.name}.apk`,
          mimetype: "application/vnd.android.package-archive",
          caption,
        },
        { quoted: mek }
      );

      await robin.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (err) {
      console.error("❌ APK Downloader Error:", err);
      reply("❌ *An error occurred while downloading the APK.*");
    }
  }
);
