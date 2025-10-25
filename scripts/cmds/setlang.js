const { languageData } = global;

module.exports = {
  config: {
    name: "setlang",
    aliases: ["لغة"],
    version: "1.0",
    author: "VexaTeam",
    countDown: 5,
    role: 2,
    shortDescription: {
      ar: "تغيير لغة البوتة.",
      en: "Change the default lang."
    },
    category: "General",
    guide: {
      ar: "{pn} <كود اللغة الجديدة>",
      en: "{pn} <new lang code>" +
        "\nExmple:" +
        "\n{pn} ar"
    }
  },

  langs: {
    ar: {
      done: "تم تغيير اللغة الأساسية إلى %1.",
      cant: "لا يمكن تغيير اللغة لأنك لم تضفها في ملف اللغات أو أن اللغة التي أدخلتها غير صحيحة.",
      missed: "أدخل اللغة من فضلك."
    },
    en: {
      done: "✅ | Changed the lang to \"%1\" lang.",
      cant: "❌ You can't use this lang mybe It is not present in the language file or your gived lang is wrong",
      missed: "please give the lang param."
    }
  },

  atCall: async function ({ args, message, event, threadsData, role, getLang }) {
    if (!args[0]) return message.reply(getLang('missed'));
    const lang = args[0].toLowerCase();
    if (lang.length > 2 || !languageData[lang]) return message.reply(getLang('cant'));
    await threadsData.set(event.threadID, lang, "data.lang");
    message.reply(getLang('done', lang));
  }
};