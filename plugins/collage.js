const { cmd } = require("../command");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");

const pendingCollage = {};
const userTemplates = {}; // Template selection per user

function createGridPositions(count, cellSize, padding) {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const positions = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      left: padding + col * (cellSize + padding),
      top: padding + row * (cellSize + padding),
    });
  }
  return { positions, cols, rows };
}

// Add image(s) to collage buffer
cmd(
  {
    pattern: "collage",
    react: "🖼️",
    desc: "Create image collage(add single image by image to buffer)",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { sender, reply }) => {
    try {
      if (!pendingCollage[sender]) pendingCollage[sender] = [];
      const images = [];

      // Check all image messages in the current message (if multiple)
      const msg = mek.message;
      const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (msg?.imageMessage) images.push(msg.imageMessage);
      else if (quoted?.imageMessage) images.push(quoted.imageMessage);
      else if (msg?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
        images.push(msg.extendedTextMessage.contextInfo.quotedMessage.imageMessage);
      }

      if (images.length === 0) return reply("❌ Please send or reply to image(s).");

      const buffer = await downloadMediaMessage(mek, "buffer", {}, robin);
      if (!buffer) return reply("❌ Failed to download image.");

      pendingCollage[sender].push(buffer);
      return reply(`✅ Added 1 image to collage. Send more or reply 'done' to create.`);

    } catch (e) {
      console.error(e);
      reply("❌ Error adding image to collage.");
    }
  }
);

// Detect 'done' and create collage
cmd(
  {
    filter: (text, { sender }) => pendingCollage[sender] && text.trim().toLowerCase() === "done",
  },
  async (robin, mek, m, { sender, reply, from }) => {
    try {
      const buffers = pendingCollage[sender];
      delete pendingCollage[sender];

      if (!buffers || buffers.length === 0) return reply("❌ No images to collage.");

      const cellSize = 300;
      const padding = 10;
      const count = buffers.length;

      const { positions, cols, rows } = createGridPositions(count, cellSize, padding);
      const width = cols * cellSize + (cols + 1) * padding;
      const height = rows * cellSize + (rows + 1) * padding;

      const template = userTemplates[sender] || "grid";
      let bgColor = "#1e1e1e";
      if (template === "polaroid") bgColor = "#ffffff";
      else if (template === "rounded") bgColor = "#121212";
      else if (template === "shadow") bgColor = "#000000";

      let collage = sharp({
        create: {
          width,
          height,
          channels: 3,
          background: bgColor,
        },
      });

      const resizedBuffers = await Promise.all(
        buffers.map(async (buf) => {
          let img = sharp(buf).resize(cellSize, cellSize, { fit: "cover" });

          if (template === "polaroid") {
            img = img.extend({ top: 10, bottom: 30, left: 10, right: 10, background: { r: 255, g: 255, b: 255 } });
          } else if (template === "rounded") {
            const roundedCorner = Buffer.from(
              `<svg><rect x='0' y='0' width='${cellSize}' height='${cellSize}' rx='40' ry='40'/></svg>`
            );
            img = img.composite([{ input: roundedCorner, blend: "dest-in" }]);
          } else if (template === "shadow") {
            img = await img
              .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 0, g: 0, b: 0 } })
              .toBuffer();
            return sharp({
              create: {
                width: cellSize + 20,
                height: cellSize + 20,
                channels: 3,
                background: { r: 0, g: 0, b: 0 },
              },
            })
              .composite([{ input: img, left: 0, top: 0 }])
              .toBuffer();
          }

          return img.toBuffer();
        })
      );

      const composites = resizedBuffers.map((buf, i) => ({
        input: buf,
        left: positions[i].left,
        top: positions[i].top,
      }));

      collage = collage.composite(composites);
      const outputBuffer = await collage.png().toBuffer();

      await robin.sendMessage(from, { image: outputBuffer, caption: `🖼️ Your collage with ${count} images.` }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply("❌ Error generating collage.");
    }
  }
);

// Set template
cmd(
  {
    pattern: "collage template ?(.*)",
    desc: "Set collage layout template.",
    category: "utilities",
  },
  async (robin, mek, m, { match, sender, reply }) => {
    const template = match.trim().toLowerCase();
    const available = ["grid", "polaroid", "rounded", "shadow"];

    if (!available.includes(template)) return reply(`❌ Invalid template. Available: ${available.join(", ")}`);

    userTemplates[sender] = template;
    const bgMap = {
      grid: "#1e1e1e",
      polaroid: "#ffffff",
      rounded: "#121212",
      shadow: "#000000",
    };
    reply(`✅ Template set to *${template}* (background: ${bgMap[template]})`);
  }
);
