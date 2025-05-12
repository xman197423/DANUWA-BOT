const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');

// Function to convert uptime in seconds to hh:mm:ss
const formatUptime = (seconds) => {
    const pad = (s) => (s < 10 ? '0' + s : s);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

cmd({
    pattern: "alive",
    react: "👀",
    desc: "Check if the bot is online and functioning.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply
}) => {
    try {
        const start = Date.now();
        const ping = Date.now() - start;
        const uptime = formatUptime(process.uptime());
        const platform = os.platform();
        const cpu = os.cpus()[0].model;

        const aliveCaption = `
╭───〔 » BOT STATUS: ✅ I'M ALIVE NOW 〕───⬣
│
│ 🔹 *Bot Name:* ${config.BOT_NAME || '🔮 DANUWA-MD 🔮'}
│ 🔹 *Status:* Online & Active ✅ 
│ 🔹 *Ping:* ${ping} ms
│ 🔹 *Uptime:* ${uptime}
│ 🔹 *Platform:* ${platform}
│ 🔹 *CPU:* ${cpu.split('@')[0].trim()}
│ 🔹 *Owner:* ${config.OWNER_NAME || 'DANUKA DISANAYAKA'}
│ 🔹 *Version:* ${config.VERSION || '1.0.0'}
│
╰───────────────⬣

📡 *Stay Connected with Me!*
🎥 *Watch & Learn Tech with Quizontal*
🔔 *Subscribe Now:* 
👉 https://www.youtube.com/@quizontal
─────────────────────────
🚀 Powered By  ${config.BOT_NAME || '*DANUKA DISANAYAKA* 🔥'}
        `.trim();

        return await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: aliveCaption
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        return reply(`❌ Error: ${error.message}`);
    }
});
