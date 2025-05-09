const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "restart",
  desc: "Restart the bot",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, {
  from, sender, reply
}) => {
  try {
    const ownerJid = config.BOT_OWNER + '@s.whatsapp.net';

    if (sender !== ownerJid) {
      return reply("❌ *Access Denied!*\nOnly the bot owner can use this command.");
    }

    const { exec } = require("child_process");

    await reply(`
♻️ *Restarting DANUWA-MD...*
Please wait while. ⏳
    `);

    await sleep(1500);

    // Restart command
    exec("pm2 restart all", (err, stdout, stderr) => {
      if (err) {
        console.error("Restart error:", err);
        return reply("❌ *Error while restarting!*");
      }
      console.log("Restart output:", stdout || stderr);

      // Optional: Confirm restart before disconnect (might not send if bot restarts too quickly)
      conn.sendMessage(from, {
        text: `
🚀 *Restart Successful!*
═══════════════════════
🔄 DANUWA-MD is now back online!

⚙️ Powered by: *Danuka Disanayaka💫*
═══════════════════════
        `
      }, { quoted: mek });
    });

  } catch (e) {
    console.log(e);
    reply("❌ *An unexpected error occurred while trying to restart the bot.*");
  }
});
