const { cmd } = require("../command");

const usageCount = new Map(); // key: userId, value: number of uses

cmd(
  {
    pattern: "password",
    alias: ["passgen", "genpass"],
    react: "🔐",
    desc: "Generate a random strong password",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply }) => {
    const userId = m.sender;

    // Increase usage count
    usageCount.set(userId, (usageCount.get(userId) || 0) + 1);
    const count = usageCount.get(userId);

    const length = parseInt(q) || 12;
    if (length < 6 || length > 64) return reply("❌ *Please specify a password length between 6 and 64.*");

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    await reply(`🔐 *Random Password (${length} chars):*\n\n\`${password}\`\n\n🔢 You have generated passwords ${count} times.`);
  }
);
