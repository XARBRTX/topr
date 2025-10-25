module.exports = {
  config: {
    name: "owner",
    aliases: ["مطور"],
    version: "1.0",
    author: "Allou Mohamed",
    countDown: 10,
    role: 0,
    shortDescription: {
      ar: "صانع النظام.",
      en: "systèm info"
    },
    category: "info",
    guide: {
      ar: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    ar: {
      info: "%1\n تم برمجته من قبل\n %2."
    },
    en: {
      info: "%1 by %2."
    }
  },

  atCall: async function ({ args, message, event, getLang }) {
    const team = "Allou Mohamed.";
    const bot = "فيكسا بوت '-'";
    
message.reply(getLang("info", bot, team));
  }
};