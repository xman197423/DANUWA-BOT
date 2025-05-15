const { cmd } = require("../command");
const PDFDocument = require("pdfkit");
const fs = require("fs").promises;
const { getRandom } = require("../lib/functions");

cmd(
  {
    pattern: "text2pdf",
    alias: ["txt2pdf"],
    react: "📄",
    desc: "Convert text to PDF",
    category: "tools",
    filename: __filename,
  },
  async (robin, mek, m, { reply, q }) => {
    if (!q) return reply("📝 *Please provide text to convert to PDF.*");

    const fileName = getRandom(".pdf");
    const doc = new PDFDocument();
    const writeStream = require("fs").createWriteStream(fileName);
    doc.pipe(writeStream);
    doc.fontSize(14).text(q, 100, 100);
    doc.end();

    await new Promise((res) => writeStream.on("finish", res));
    const buffer = await fs.readFile(fileName);
    await robin.sendMessage(m.chat, { document: buffer, mimetype: "application/pdf",caption: "🖼️ Text to Pdf\n─────────────────────────\n⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*", fileName }, { quoted: mek });
    await fs.unlink(fileName);
  }
);
