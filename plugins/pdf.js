const { cmd } = require("../command");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");

const pendingPapers13 = {};

// Fetch list of Grade 13 papers
async function fetchGrade13Papers() {
  const res = await axios.get("https://pastpapers.wiki/grade-13-term-test-papers-past-papers-short-notes/");
  const $ = cheerio.load(res.data);
  const results = [];

  $("a[href$='.pdf']").each((i, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");
    if (title && link) results.push({ title, link });
  });

  return results;
}

// .paper13 [subject/keyword]
cmd(
  {
    pattern: "paper13",
    react: "📘",
    desc: "Download Grade 13 past papers from pastpapers.wiki",
    category: "education",
    filename: __filename,
  },
  async (robin, mek, m, { q, from, sender, reply }) => {
    if (!q) return reply("🔍 *Please enter a subject to search Grade 13 papers.*");

    try {
      reply("🔍 Searching Grade 13 past papers...");
      const all = await fetchGrade13Papers();
      const matched = all.filter(p => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 5);

      if (!matched.length) return reply("❌ *No matching papers found. Try another subject.*");

      let text = `📘 *Top matches for:* _${q}_\n\n`;
      matched.forEach((m, i) => text += `*${i + 1}.* ${m.title}\n`);
      text += `\n💡 *Reply with a number (1-${matched.length}) to download.*`;

      await robin.sendMessage(from, { text }, { quoted: mek });
      pendingPapers13[sender] = { matched, quoted: mek };
    } catch (e) {
      console.error(e);
      reply("⚠️ Error occurred while searching.");
    }
  }
);

// Handle reply to download PDF
cmd(
  {
    filter: (text, { sender }) => pendingPapers13[sender] && /^[1-5]$/.test(text.trim()),
  },
  async (robin, mek, m, { body, sender, from, reply }) => {
    const choice = parseInt(body.trim()) - 1;
    const { matched, quoted } = pendingPapers13[sender];
    delete pendingPapers13[sender];

    if (choice < 0 || choice >= matched.length) return reply("❌ Invalid choice.");

    const { title, link } = matched[choice];
    reply(`📥 Downloading: *${title}*`);

    try {
      const filePath = path.join(tmpdir(), `${Date.now()}.pdf`);
      const res = await axios.get(link, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await robin.sendMessage(from, {
        document: { url: filePath },
        mimetype: "application/pdf",
        fileName: `${title}.pdf`,
        caption: `📘 *${title}* from pastpapers.wiki`,
      }, { quoted });

      fs.unlinkSync(filePath);
    } catch (e) {
      console.error(e);
      reply("❌ Failed to download the paper.");
    }
  }
);
