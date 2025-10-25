const chuden = require("tesseract.js");
const rehat = require("lodash");

function removeUselessSymbols(text) {
  const symbolsToRemove = /[^\w\s\u0980-\u09FF]/g;
  return text.replace(symbolsToRemove, "");
}

module.exports = {
  config: {
    name: "ocr",
    aliases: ["نص"],
    version: "1.0",
    author: "Turtle Rehat",
    category: "Tools",
    shortDescription: {
      ar: "إستخراج نص من صورة.",
      en: "Extract text from photos."
    },
    guide: {
      en: "{pn} reply to photo.",
      ar: "{pn} رد على صورة."
    }
  },
  langs: {
    en: {
      reply: "Reply to picture only.",
      only: "Only English texts."
    },
    ar: {
      reply: "رد على صورة.",
      only: "فقط الصور التي فيها نص إنجليزي."
    }
  },

  atCall: async function ({ message, event, getLang }) {
    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]?.type === "photo") {
        const imageUrl = event.messageReply.attachments[0].url;
        const processingMessage = await message.reply("✅ | Please wait...");

        try {
          const { data: { text } } = await chuden.recognize(imageUrl, "eng+ben");
          if (text) {
            const formattedText = rehat.trim(text);
            const cleanText = removeUselessSymbols(formattedText);

            message.reply(`${cleanText}`);
          } else {
            message.reply("❌ | An error occurred.");
          }
        } catch (error) {
          console.error(error);
          message.reply("❌ | An error occurred.");
        }

        await message.unsend((await processingMessage)?.messageID);
      } else {
        message.reply("❌ | Please reply with an image.");
      }
    } else {
      message.reply("❌ | Please reply with an image.");
    }
  },
};