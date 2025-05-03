const { cmd } = require("../command");
const yts = require("yt-search");
const { ytmp4 } = require("@vreden/youtube_scraper");

const qualityOptions = ["360", "480", "720", "1080"];
const pendingQuality = {};

cmd(
  {
    pattern: "video",
    react: "📹",
    desc: "Download YouTube Video",
    category: "download",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, sender, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a video name or YouTube link* 🎥");

      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      let desc = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
      🎬 𝙑𝙄𝘿𝙀𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 🎬  
════════════════════════   

🎬 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📅 *Uploaded:* ${data.ago}
👁️ *Views:* ${data.views.toLocaleString()}
🔗 *Watch:* ${data.url}

─────────────────────────
💡 *Reply with a number to select quality:*
${qualityOptions.map((q, i) => `${i + 1}. ${q}p`).join("\n")}

🎥 Made with ❤️ by *DANUKA DISANAYAKA💫*
`;

      await robin.sendMessage(from, {
        image: { url: data.thumbnail },
        caption: desc,
      }, { quoted: mek });

      pendingQuality[sender] = {
        url,
        title: data.title,
        quoted: mek,
      };
    } catch (e) {
      console.log(e);
      reply("❌ *Error:* " + e.message);
    }
  }
);

// Reply-based quality selection
cmd(
  {
    filter: (text, { sender }) => {
      return pendingQuality[sender] && /^[1-4]$/.test(text.trim());
    },
  },
  async (robin, mek, m, { from, body, sender, reply }) => {
    const selected = parseInt(body.trim()) - 1;
    const quality = qualityOptions[selected];
    const { url, title, quoted } = pendingQuality[sender];
    delete pendingQuality[sender];

    // 🌟 Send "please wait" message
    await reply(`
╭───────────────⭓
│ ⏳ *Please wait...*
│ 📥 *Downloading ${quality}p video...*
│ 🎬 *${title}*
╰───────────────⭓
`);

    try {
      const video = await ytmp4(url, quality);
      await robin.sendMessage(from, {
        video: { url: video.download.url },
        caption: `
🎞️ *${title}* - ${quality}p
📥 Your download is ready!

━━━━━━━━━━━━━━━━━━━━━━
🚀 Powered by *DANUWA-MD*
🎉 Developed with ❤️ by *DANUKA DISANAYAKA*
`,
      }, { quoted });
    } catch (e) {
      console.log(e);
      reply("❌ *Failed to download the video.*");
    }
  }
);
