const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "menu",
    desc: "Displays all available commands",
    category: "main",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      pushname,
      reply
    }
  ) => {
    try {
      const categoryEmojis = {
        main: "📁",
        owner: "👑",
        group: "👥",
        tools: "🛠️",
        media: "🎞️",
        download: "📥",
        fun: "🎮",
        search: "🔍",
        other: "❓"
      };

      let heading = `
            🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  

        ⚙ SYSTEM CORE MENU ⚙
════════════════════════   
`;

      let menuText = ``;

      const categories = {};

      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description"
        });
      }

      for (const [cat, cmds] of Object.entries(categories)) {
        const emoji = categoryEmojis[cat] || "📂";
        menuText += `\n${emoji} *${cat.toUpperCase()}*\n─────────────────────────\n`;
        cmds.forEach(c => {
          menuText += `🔹 *${c.pattern}* — ${c.desc}\n`;
        });
      }

      menuText += `
════════════════════════   
🚀 Powered By  ${config.BOT_NAME || '*DANUKA DISANAYAKA* 🔥'}
`;

      await conn.sendMessage(
        from,
        {
          image: {
            url: config.ALIVE_IMG || "https://github.com/DANUWA-MD/DANUWA-BOT/blob/main/images/Danuwa%20-%20MD.png?raw=true",
          },
          caption: heading + menuText
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
