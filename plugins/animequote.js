const { commands } = require('../command');

const animeQuotes = [
  {
    anime: "Naruto",
    character: "Kakashi Hatake",
    quote: "In the ninja world, those who break the rules are scum, that's true... but those who abandon their friends are worse than scum."
  },
  {
    anime: "Attack on Titan",
    character: "Levi Ackerman",
    quote: "The only thing we're allowed to do is to believe that we won't regret the choice we made."
  },
  {
    anime: "One Piece",
    character: "Monkey D. Luffy",
    quote: "Power isn’t determined by your size, but the size of your heart and dreams!"
  },
  {
    anime: "Death Note",
    character: "L Lawliet",
    quote: "There’s no heaven or hell. No matter what you do while you’re alive, everybody goes to the same place once you die."
  },
  {
    anime: "Fullmetal Alchemist: Brotherhood",
    character: "Edward Elric",
    quote: "A lesson without pain is meaningless. That’s because you can’t gain something without sacrificing something else."
  }
];

commands.push({
  pattern: 'animequote',
  desc: 'Get a random anime quote',
  category: 'anime',
  react: '🗯️',
  function: async (sock, m, msg, { reply }) => {
    try {
      const random = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];

      const caption = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
📜  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  📜  
            📍 *_ANIME QUOTE_* 📍  
════════════════════════   

🗣️ *Character:* ${random.character}
🎥 *Anime:* ${random.anime}
💬 *Quote:* "${random.quote}"

─────────────────────────
🛠️ Made with ❤️ By *DANUKA DISANAYAKA💫*
      `;

      await reply(caption);
    } catch (err) {
      console.error('AnimeQuote Error:', err);
      await reply('❌ Failed to fetch anime quote.');
    }
  }
});
