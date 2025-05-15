const { cmd } = require("../command");

const conversions = {
  // from unit: { to unit: multiplier }
  cm: { in: 0.3937, mm: 10, m: 0.01, km: 0.00001, ft: 0.0328084, mi: 0.0000062137 },
  in: { cm: 2.54, mm: 25.4, m: 0.0254, km: 0.0000254, ft: 0.0833333, mi: 0.000015783 },
  mm: { cm: 0.1, in: 0.03937, m: 0.001, km: 0.000001, ft: 0.00328084, mi: 0.000000621371 },
  m: { cm: 100, in: 39.3701, mm: 1000, km: 0.001, ft: 3.28084, mi: 0.000621371 },
  km: { cm: 100000, in: 39370.1, mm: 1000000, m: 1000, ft: 3280.84, mi: 0.621371 },
  ft: { cm: 30.48, in: 12, mm: 304.8, m: 0.3048, km: 0.0003048, mi: 0.000189394 },
  mi: { cm: 160934, in: 63360, mm: 1609340, m: 1609.34, km: 1.60934, ft: 5280 },
};

cmd(
  {
    pattern: "unit",
    alias: ["unitconvert"],
    react: "📏",
    desc: "Convert length units: cm, mm, m, km, in, ft, mi",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply }) => {
    if (!q) return reply(
      "📝 *Usage:* convert <value><unit> to <unit>\n" +
      "Example: convert 10cm to in\n" +
      "Supported units: cm, mm, m, km, in, ft, mi"
    );

    // Parse input like: "10cm to in" or "5 km to mi"
    const input = q.toLowerCase().trim();
    const regex = /^([\d.]+)\s*([a-z]+)\s*(to)?\s*([a-z]+)$/;
    const match = input.match(regex);

    if (!match) {
      return reply("❌ *Invalid format. Use e.g. 10cm to in*");
    }

    let [, valueStr, fromUnit, , toUnit] = match;
    const value = parseFloat(valueStr);
    if (isNaN(value)) return reply("❌ *Invalid number.*");

    if (!(fromUnit in conversions)) return reply(`❌ *Unsupported from-unit '${fromUnit}'.*`);
    if (!(toUnit in conversions[fromUnit])) return reply(`❌ *Unsupported to-unit '${toUnit}'.*`);

    const multiplier = conversions[fromUnit][toUnit];
    const converted = (value * multiplier).toFixed(5);

    await reply(`📏 *${value} ${fromUnit}* = *${converted} ${toUnit}*`);
  }
);
