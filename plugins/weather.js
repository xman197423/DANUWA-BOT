const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "weather",
    alias: ["forecast"],
    react: "🌦️",
    desc: "Get weather information for a city",
    category: "utilities",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      q,
      reply,
      from,
    }
  ) => {
    if (!q) return reply("🌍 *Please provide a city name!* Example: `.weather Colombo`");

    try {
      const apiKey = "382d2114ff4b424a873125229251405"; // Replace with your key from https://weatherapi.com
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);

      const city = data.location.name;
      const country = data.location.country;
      const localTime = data.location.localtime;
      const condition = data.current.condition.text;
      const temp = data.current.temp_c;
      const humidity = data.current.humidity;
      const wind = data.current.wind_kph;

      const desc = `
           🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ －Ｍ Ｄ  🔮 
      ☁️ *_𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗥𝗘𝗣𝗢𝗥𝗧_* ☁️  
════════════════════════  

📍 *City*: ${city}
🌎 *Country*: ${country}
🕐 *Local Time*: ${localTime}
🌡️ *Temperature*: ${temp}°C
💧 *Humidity*: ${humidity}%
💨 *Wind Speed*: ${wind} km/h
🌤️ *Condition*: ${condition}

─────────────────────────
⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*
      `.trim();

      // Custom image (hosted rain/weather image)
      const rainImage = "https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images/weather.jpg?raw=true";

      await robin.sendMessage(
        from,
        {
          image: { url: rainImage },
          caption: desc,
        },
        { quoted: mek }
      );

      return reply("✅ *Weather report sent successfully!*");
    } catch (err) {
      console.error(err);
      reply("❌ *Couldn't fetch weather data.* Please check the city name or try again later.");
    }
  }
);
