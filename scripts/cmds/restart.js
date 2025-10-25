const fs = require("fs-extra");

module.exports = {
  config: {
    name: "restart",
    aliases: ["ريلوود"],
    version: "1.0",
    author: "Allou Mohamed",
    countDown: 5,
    role: 2,
    shortDescription: {
      ar: "إعادة تشغيل البوت.",
      en: "Restart bot"
    },
    category: "Owner",
    guide: {
      ar: "   {pn}: إعادة تشغيل البوت",
      en: "   {pn}: Restart bot"
    }
  },

  langs: {
    ar: {
      restartting: "🔄 | جاري إعادة تشغيل البوت."
    },
    en: {
      restartting: "🔄 | Restarting bot..."
    }
  },

  onLoad: function ({ api }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
      api.sendMessage(`✅ | Done (تم).\n⏰ | Time (الزمن): ${(Date.now() - time) / 1000}s.`, tid);
      fs.unlinkSync(pathFile);
    }
  },

  atCall: async function ({ message, event, getLang }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
    await message.reply(getLang("restartting"));
    process.exit(2);
  }
};