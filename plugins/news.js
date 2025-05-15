const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "news",
    alias: ["latestnews", "headlines"],
    react: "📰",
    desc: "Get the latest news headlines from various categories",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { from, reply, q }) => {
    try {
      if (!q) return reply("Please provide a category! Example: `.news tech`");

      const apiKey = "a49fcf62336548aeb5b2798eafa13383"; // Replace with your NewsAPI key
      const url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(q)}&apiKey=${apiKey}`;

      const { data } = await axios.get(url);
      const articles = data.articles;

      if (articles.length === 0) {
        return reply("No news found in this category. Try another category!");
      }

      let newsList = "";
      articles.slice(0, 5).forEach((article, index) => {
        newsList += `
${index + 1}. *${article.title}*  
🔗 ${article.url}  
📰 Source: ${article.source.name}

`;
      });

      await robin.sendMessage(from, { text: newsList }, { quoted: mek });
    } catch (err) {
      console.error(err);
      reply("❌ *Couldn't fetch the latest news. Please try again later.*");
    }
  }
);
