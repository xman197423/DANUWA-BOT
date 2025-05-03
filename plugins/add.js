const { cmd } = require("../command");

cmd(
  {
    pattern: "add",
    alias: [],
    react: "➕",
    desc: "Add a member to the group (fallback to invite if blocked)",
    category: "group",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      isGroup,
      isAdmins,
      isBotAdmins,
      reply,
      participants,
      quoted,
      args,
    }
  ) => {
    if (!isGroup) return reply("*This command is only for groups!*");
    if (!isAdmins) return reply("*You must be an admin to use this command!*");
    if (!isBotAdmins) return reply("*I must be admin to add users!*");

    let number;

    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      number = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (quoted?.sender) {
      number = quoted.sender;
    } else if (args[0]) {
      const clean = args[0].replace(/[^0-9]/g, "");
      number = clean + "@s.whatsapp.net";
    }

    if (!number) return reply("*Mention a user, reply to a user, or provide a number!*");

    try {
      const result = await robin.groupParticipantsUpdate(m.chat, [number], "add");

      if (!result || !result[0]) throw new Error("No response from WhatsApp");

      const status = result[0].status;

      if (status === "200") {
        return reply(`✅ *Successfully added:* @${number.split("@")[0]}`, {
          mentions: [number],
        });
      } else if (status === "403") {
        // Fallback: send invite link if adding fails due to privacy
        try {
          const code = await robin.groupInviteCode(m.chat);
          const link = `https://chat.whatsapp.com/${code}`;
          await robin.sendMessage(number, {
            text: `👋 You've been invited to join the group *${m.metadata?.subject || 'this group'}*\n\n🔗 Click to join: ${link}`,
          });
          return reply(`⚠️ Couldn't add @${number.split("@")[0]} due to privacy settings.\n✅ Invite link sent privately.`, {
            mentions: [number],
          });
        } catch (inviteErr) {
          console.error("Invite fallback error:", inviteErr);
          return reply(`❌ Can't add or send invite to @${number.split("@")[0]}.`, {
            mentions: [number],
          });
        }
      } else if (status === "408") {
        return reply(`❌ Number @${number.split("@")[0]} is not on WhatsApp.`, {
          mentions: [number],
        });
      } else {
        return reply(`❌ Unknown error while adding @${number.split("@")[0]}.\nStatus: ${status}`, {
          mentions: [number],
        });
      }
    } catch (err) {
      console.error("Add error:", err);
      return reply(`❌ Failed to add @${number.split("@")[0]}. Error: ${err.message}`, {
        mentions: [number],
      });
    }
  }
);
