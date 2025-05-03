const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "restart",
    desc: "restart the bot",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        // Ensure full JID format (like 94776121326@s.whatsapp.net)
        const ownerJid = config.BOT_OWNER + '@s.whatsapp.net';

        // Check if the command user is the owner
        if (sender !== ownerJid) {
            return reply("❌ This command is only for the bot owner.");
        }

        const { exec } = require("child_process");
        reply("♻️ Restarting...");
        await sleep(1500);
        exec("pm2 restart all");
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
