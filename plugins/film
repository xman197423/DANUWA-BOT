const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const pendingTorrents = {};
let WebTorrentClient = null;

async function getWebTorrentClient() {
  if (!WebTorrentClient) {
    const WebTorrent = (await import("webtorrent")).default;
    WebTorrentClient = new WebTorrent();
    WebTorrentClient.maxConns = 200;
  }
  return WebTorrentClient;
}

cmd(
  {
    pattern: "film",
    react: "🎞️",
    desc: "Download any type movies",
    category: "download",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, sender, reply }) => {
    if (!q) return reply("❌ *Please provide a movie name to search on YTS.* 🎬");

    try {
      const res = await axios.get(`https://yts.mx/api/v2/list_movies.json`, {
        params: { query_term: q, limit: 1 },
      });

      const movie = res.data.data.movies?.[0];
      if (!movie) return reply("❌ *No results found for that movie.*");

      const { title, year, medium_cover_image, torrents } = movie;

      let caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
     🎬 𝙈𝙊𝙑𝙄𝙀 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 🎬  
════════════════════════    

🎬 *Title:* ${title}
📅 *Year:* ${year}
📥 *Available Qualities:*

${torrents.map((t, i) => `*${i + 1}.* 🎚️ ${t.quality} — ${t.size}`).join("\n")}

─────────────────────────
💡 *Reply with a number to select & download.*
─────────────────────────
⚙️ Made with ❤️ By *DANUKA DISANAYAKA💫*
`;

      await robin.sendMessage(from, {
                      image: { url: "https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images/movie.png?raw=true" },
                      caption,
                }, { quoted: mek });


      pendingTorrents[sender] = { torrents, title, quoted: mek };
    } catch (e) {
      console.error(e);
      reply("⚠️ *Error searching YTS:* " + e.message);
    }
  }
);

cmd(
  {
    filter: (text, { sender }) => {
      return pendingTorrents[sender] && /^[1-9][0-9]*$/.test(text.trim());
    },
  },
  async (robin, mek, m, { from, body, sender, reply }) => {
    const index = parseInt(body.trim(), 10) - 1;
    const pending = pendingTorrents[sender];
    if (!pending || index < 0 || index >= pending.torrents.length) {
      return reply("❌ *Invalid selection. Try again with a valid number.*");
    }

    const { hash, quality } = pending.torrents[index];
    const { title, quoted } = pending;
    delete pendingTorrents[sender];

    const magnet = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337`;

    await reply(`
╭───────────────⭓
│ ⏳ *Please wait...*
│ 📥 *Downloading movie...*
│ 🎬 *${title} (${quality})*
╰───────────────⭓
`);

    const slug = `${title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_")}_${Date.now()}`;
    const downloadPath = __dirname;

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    try {
      const client = await getWebTorrentClient();
      client.add(magnet, { path: downloadPath }, torrent => {
        torrent.on("done", async () => {
          const movieFile = torrent.files
            .filter(f => /\.(mp4|mkv|avi|mov)$/i.test(f.name))
            .sort((a, b) => b.length - a.length)[0];

          if (!movieFile) return reply("❌ *No playable video file found in torrent.*");

          movieFile.select();

          const ext = path.extname(movieFile.name);
          const cleanTitle = title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
          const newFileName = `${cleanTitle} - DANUWA-MD❤️${ext}`;
          const originalPath = path.join(downloadPath, movieFile.path);
          const renamedPath = path.join(downloadPath, newFileName);

          fs.renameSync(originalPath, renamedPath);

          const mime = ext === ".mp4" ? "video/mp4" : "video/x-matroska";

          try {
            await robin.sendMessage(from, {
              document: { url: renamedPath },
              fileName: newFileName,
              mimetype: mime,
              caption: `
🎞️ *${title}* — ${quality}
✅ *Movie download complete!*

━━━━━━━━━━━━━━━━━━━━━━
🚀 Pow. By *DANUKA DISANAYAKA* 🔥
📽️ Enjoy your movie!
              `,
            }, { quoted });
          } catch (e) {
            console.error("Send error:", e);
            reply("❌ *Failed to send the movie file.*");
          } finally {
            setTimeout(() => {
              try {
                fs.rmSync(downloadPath, { recursive: true, force: true });
              } catch (err) {
                console.warn("Cleanup failed:", err.message);
              }
            }, 60 * 1000);
          }
        });

        setTimeout(() => {
          if (!torrent.done) {
            torrent.destroy();
            reply("⌛ *Download timed out after 15 minutes. Please try again later.*");
          }
        }, 15 * 60 * 1000);
      });
    } catch (err) {
      console.error(err);
      reply("❌ *Torrent error:* " + err.message);
    }
  }
);
