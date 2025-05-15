const { cmd } = require("../command");

const morseCode = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
  F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
  P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
  Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--",
  4: "....-", 5: ".....", 6: "-....", 7: "--...",
  8: "---..", 9: "----.",
  " ": "/"
};

function textToMorse(text) {
  return text.toUpperCase().split("")
    .map(c => morseCode[c] || "")
    .join(" ");
}

function morseToText(morse) {
  const reversed = Object.entries(morseCode).reduce((acc, [k, v]) => (acc[v] = k, acc), {});
  return morse.split(" ")
    .map(code => reversed[code] || "")
    .join("");
}

cmd(
  {
    pattern: "morse",
    react: "📡",
    desc: "Convert text to Morse or Morse to text",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply }) => {
    if (!q) return reply("📝 *Provide text or Morse code separated by spaces.*");

    // Check if input looks like Morse (only dots, dashes, slashes and spaces)
    const isMorse = /^[.\-\/\s]+$/.test(q.trim());

    if (isMorse) {
      // Decode Morse
      const decoded = morseToText(q);
      await reply(`📥 *Decoded Text:*\n\n${decoded}`);
    } else {
      // Encode text
      const encoded = textToMorse(q);
      await reply(`📤 *Encoded Morse:*\n\n${encoded}`);
    }
  }
);
