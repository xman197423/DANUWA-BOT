const { cmd, commands } = require("../command"); 

cmd(
  {
    pattern: "list",
    react: "📝",
    alias: ["help", "commands"],
    desc: "Show all available commands",
    category: "main",
    filename: __filename,
  },
  async (danuwa, m, msg, { from, reply }) => {
    const commandMap = {};

    // Group commands by category
    for (const command of commands) {
      if (command.dontAddCommandList) continue;

      const category = (command.category || "misc").toUpperCase();
      if (!commandMap[category]) commandMap[category] = [];

      const patterns = [command.pattern, ...(command.alias || [])]
        .filter(Boolean)
        .map(p => `.${p}`);

      commandMap[category].push(patterns.join(", "));
    }

    let menuText = `
╭━━━⚡ *ＤＡＮＵＷＡ－ＭＤ* ⚡━━⬣
           🔮 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🔮
╰━━━━━━━━━━━━━━━━━━━━━━━⬣
`;

    for (const category of Object.keys(commandMap).sort()) {
      menuText += `\n┣━━ ⪼ *${category}*\n`;
      menuText += commandMap[category].map(cmd => `┃🔸 ${cmd}`).join("\n") + "\n";
    }

    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━⬣

┃━━━━━━━━━━━━━━━━━━━━━━⬣
┃⚙️ Made with ❤️ by 
╰─🔥 *_DANUKA DISANAYAKA_* 🔥─⬣
`;

    await danuwa.sendMessage(from, { text: menuText }, { quoted: m });
  }
);
