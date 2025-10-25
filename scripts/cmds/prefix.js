const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    aliases: ["رمز"],
    version: "1.3",
    author: "VexaTeam",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "change bot prefix.",
      ar: "تغيير رمز البوت."
    },
    category: "config",
    guide: {
      ar: "   {pn} <الرمز الجديد>: ضع رمز جديد"
        + "\n   مثل:"
        + "\n    {pn} #"
        + "\n\n   {pn} <رمز جديد> -g: تغيير رمز النظام"
        + "\n   مثل:"
        + "\n    {pn} # -g"
        + "\n\n   {pn} أصلي: إعادة الرمز الأساسي.",
      en: "   {pn} <new prefix>: change new prefix in your box chat"
        + "\n   Example:"
        + "\n    {pn} #"
        + "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
        + "\n   Example:"
        + "\n    {pn} # -g"
        + "\n\n   {pn} reset: change prefix in your box chat to default"
    }
  },

  langs: {
    ar: {
      removed: "تم حذف رمز المجموعة",
      reset: "تمت إعادة تعيين رمز البادئ الخاص بك إلى الإعداد الافتراضي: %1",
      onlyAdmin: "يمكن للمسؤول فقط تغيير رمز نظام البوت",
      confirmGlobal: "يرجى إسقاط أي رد فعل في هذه الرسالة لتأكيد تغيير رمز النظام بأكمله للبوت",
      confirmThisThread: "يرجى إسقاط أي رد فعل في هذه الرسالة لتأكيد تغيير رمز الدردشة في مجموعتك",
      successGlobal: "تم تغيير رمز نظام البوت بنجاح إلى: %1",
      successThisThread: "تم تغيير رمز المحادثة في مجموعتك بنجاح إلى: %1",
      myPrefix: "🌐 رمز النظام: %1\n🛸 رمز مجموعتك: %2"
    },
    en: {
      removed: "Your GC prefix removed.",
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal: "Please react to this message to confirm change prefix of system bot",
      confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "Changed prefix of system bot to: %1",
      successThisThread: "Changed prefix in your box chat to: %1",
      myPrefix: "🌐 System prefix: %1\n🛸 Your box chat prefix: %2"
    }
  },

  atCall: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.err();

    if (args[0] == 'reset' || args[0] == 'أصلي') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.VexaBot.config.prefix));
    }
    if (args[0] == 'remove' || args[0] == 'حذف') {
      await threadsData.set(event.threadID, "NO", "data.prefix");
      return message.reply(getLang("removed"));
    }
    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g")
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    else
      formSet.setGlobal = false;

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.VexaBot.atReact.set(info.messageID, formSet);
    });
  },

  atReact: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.VexaBot.config.prefix = newPrefix;
      fs.writeFileSync(global.VexaBot.dirConfig, JSON.stringify(global.VexaBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  atChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "prefix" || event.body && event.body.toLowerCase() === "الرمز")
        return message.reply(getLang("myPrefix", global.VexaBot.config.prefix, utils.getPrefix(event.threadID)));   
  }
};