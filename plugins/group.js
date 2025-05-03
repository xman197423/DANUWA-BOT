const { cmd } = require("../command");

cmd(
  {
    pattern: "kick",
    alias: [],
    react: "👢",
    desc: "Kick mentioned or replied user from group",
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
    if (!isBotAdmins) return reply("*I must be admin to kick users!*");

    let target;

    // Try to get mentioned user
    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // Or get from replied message
    else if (quoted?.sender) {
      target = quoted.sender;
    }
    // Or get from args (optional)
    else if (args[0]?.includes("@")) {
      target = args[0].replace("@", "") + "@s.whatsapp.net";
    }

    if (!target) return reply("*Mention a user or reply to their message to kick!*");

    const isTargetAdmin = participants.find(p => p.id === target)?.admin;

    if (isTargetAdmin) return reply("*I can't kick an admin!*");

    await robin.groupParticipantsUpdate(m.chat, [target], "remove");

    return reply(`*Kicked:* @${target.split("@")[0]}`, {
      mentions: [target],
    });
  }
);

// Promote command
cmd(
  {
    pattern: "promote",
    alias: [],
    react: "⬆️",
    desc: "Promote mentioned or replied user to admin",
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
    if (!isBotAdmins) return reply("*I must be admin to promote users!*");

    let target;

    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (quoted?.sender) {
      target = quoted.sender;
    } else if (args[0]?.includes("@")) {
      target = args[0].replace("@", "") + "@s.whatsapp.net";
    }

    if (!target) return reply("*Mention a user or reply to their message to promote!*");

    await robin.groupParticipantsUpdate(m.chat, [target], "promote");

    return reply(`*Promoted:* @${target.split("@")[0]}`, {
      mentions: [target],
    });
  }
);

// Demote command
cmd(
  {
    pattern: "demote",
    alias: [],
    react: "⬇️",
    desc: "Demote mentioned or replied user from admin",
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
    if (!isBotAdmins) return reply("*I must be admin to demote users!*");

    let target;

    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (quoted?.sender) {
      target = quoted.sender;
    } else if (args[0]?.includes("@")) {
      target = args[0].replace("@", "") + "@s.whatsapp.net";
    }

    if (!target) return reply("*Mention a user or reply to their message to demote!*");

    await robin.groupParticipantsUpdate(m.chat, [target], "demote");

    return reply(`*Demoted:* @${target.split("@")[0]}`, {
      mentions: [target],
    });
  }
);

// Open group command (allow everyone to send messages)
cmd(
  {
    pattern: "open",
    alias: [],
    react: "🔓",
    desc: "Allow everyone to send messages in the group",
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
    }
  ) => {
    if (!isGroup) return reply("*This command is only for groups!*");
    if (!isAdmins) return reply("*You must be an admin to use this command!*");
    if (!isBotAdmins) return reply("*I must be admin to open the group!*");

    try {
      // Allow all members to send messages in the group (make it open)
      await robin.groupSettingUpdate(m.chat, "announcement", "false");  // Allow all members to send messages
      return reply("*Group is now open. Everyone can send messages!*");
    } catch (error) {
      console.error(error);
      return reply("*Failed to open the group. Please try again later!*");
    }
  }
);

// Close group command (only admins can send messages)
cmd(
  {
    pattern: "close",
    alias: [],
    react: "🔒",
    desc: "Only admins can send messages in the group",
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
    }
  ) => {
    if (!isGroup) return reply("*This command is only for groups!*");
    if (!isAdmins) return reply("*You must be an admin to use this command!*");
    if (!isBotAdmins) return reply("*I must be admin to close the group!*");

    try {
      // Allow only admins to send messages in the group (make it closed)
      await robin.groupSettingUpdate(m.chat, "announcement", "true");  // Restrict messages to admins only
      return reply("*Group is now closed. Only admins can send messages!*");
    } catch (error) {
      console.error(error);
      return reply("*Failed to close the group. Please try again later!*");
    }
  }
);

