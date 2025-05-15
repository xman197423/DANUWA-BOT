const { cmd } = require("../command");

const emojiMap = {
  happy: "😊",
  sad: "😢",
  love: "❤️",
  fire: "🔥",
  cool: "😎",
  cat: "🐱",
  dog: "🐶",
  sun: "☀️",
  star: "⭐",
  pizza: "🍕",
  coffee: "☕",
};

cmd(
  {
    pattern: "emoji",
    react: "😀",
    desc: "Translate words to emojis",
    category: "fun",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply }) => {
    if (!q) return reply("📝 *Please provide text to translate to emojis.*");
    const words = q.toLowerCase().split(/\s+/);
    let translated = words.map(word => emojiMap[word] || word).join(" ");
    await reply(`😀 *Emoji Translation:*\n\n${translated}`);
  }
);
