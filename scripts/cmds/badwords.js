module.exports = {
  config: {
    name: "badwords",
    aliases: ["بانووردس"],
    version: "1.1",
    author: "VexaTeam",
    countDown: 10,
    role: 1,
    shortDescription: {
      ar: "إضافة وحذف كلمات محظورة",
      en: "Add and remove banned words"
    },
    category: "box chat",
    guide: {
      ar: '   {pn} [add | اضف] <word>: إضافة كلمة محظورة\n	  {pn} [remove | حذف] <word>: حذف كلمة محظورة\n	  {pn} [list]: عرض قائمة الكلمات المحظورة',
      en: '   {pn} [add] <word>: Add a banned word\n	  {pn} [remove] <word>: Remove a banned word\n	  {pn} [list]: List all banned words'
    }
  },

  langs: {
    ar: {
      added: "تم إضافة %1 إلى قائمة الكلمات المحظورة.",
      removed: "تم حذف %1 من قائمة الكلمات المحظورة",
      list: "قائمة الكلمات المحظورة:\n%1.",
      warn: "لا تستعمل هذه الكلمة كثيرًا أو ستحظر من هذه الدردشة.",
      ban: "تم تبنيد %1 لأن كلامه يحتوي على الكثير من السب.",
      missed: "أضف أو حذف وأدخل الكلمة التي تريد أو أكتب تشغيل أو إيقاف.",
      detected: "الكلام %1 ممنوع لا تستخدمه كثيرا نصيحة هه.\n%2:%3/5 🥺🥰",
      noList: "مافي كلام محضور يلا الكل سبوا 😆",
      badowner: "أنت تسب و أنت مطور لا يمكن طردك.",
      noWord: "%1 لا توجد في القائمة '-'",
      unban: "تم فك البان عن %1 ✅",
      on: "✅ تم تشغيل حضر الكلام السيئ.",
      off: "❌ تم إيقاف حضر الكلام السيئ.",
      admin: "❌ إجعل البوت أدمن أولا يا أخ(ت)ي."
    },
    en: {
      added: "Done ✅ added %1 to banned words.",
      removed: "Done ✅ removed %1 from banned words",
      list: "List of banned words:\n%1.",
      warn: "Don't use this word too much or you may get banned from this chat.",
      ban: "banned %1 because his words contained a lot of cursing.",
      missed: "add or remove and enter the word or turn it on or off",
      detected: "Words:\"%1\" are banned don't use them more.\n%2:%3/5🥺🥰",
      noList: "No banned words Let's start cursing 😆.",
      badowner: "You're admin i can't kick you.",
      noWord: "The word %1 is not in the banned words list.",
      unban: "Unbanned user %1 ✅",
      on: "✅ Turned on badwords ban.",
      off: "❌ Turned off badwords ban.",
      admin: "The bot need admin permission to use the command."
    }
  },

  atCall: async function ({ args, threadsData, message, event, usersData, getLang, isAdmin }) {
    if (!isAdmin()) return message.reply(getLang('admin'));
    if (!args[0]) return message.reply(getLang('missed'));
    const action = args[0].toLowerCase();
    if (action == "on" || action == "تشغيل") {
      await threadsData.set(event.threadID, true, "data.banwordsstatus");
      message.reply(getLang('on'));
      return;
    }
    if (action == "off" || action == "إيقاف") {
      await threadsData.set(event.threadID, false, "data.banwordsstatus");
      message.reply(getLang('off'));
      return;
    }
    if (action === "add" || action === "اضف") {
      const word = args.slice(1)?.map(i => i.toLowerCase());
      if (!word) return message.reply(getLang('missed'));
      const badwords = await threadsData.get(event.threadID, "data.badwords") || [];
      const add = word.concat(badwords);
      await threadsData.set(event.threadID, add, "data.badwords");
      message.reply(getLang('added', word));
      return;
    } else if (action === "remove" || action === "حذف") {
      const wordToRemove = args[1]?.toLowerCase();
      if (!wordToRemove) return message.reply(getLang('missed'));
      const badwords = await threadsData.get(event.threadID, "data.badwords") || [];
      const indexToRemove = badwords.indexOf(wordToRemove);
      if (indexToRemove !== -1) {
        badwords.splice(indexToRemove, 1);
        await threadsData.set(event.threadID, badwords, "data.badwords");
        message.reply(getLang('removed', wordToRemove));
      } else {
        message.reply(getLang("noWord", wordToRemove));
      }
      return;
    } else if (action === "list") {
      const badwords = await threadsData.get(event.threadID, "data.badwords") || [];
      if (badwords.length < 1) return message.reply(getLang('noList'));
      const formattedList = badwords.map(word => `• ${word}`).join("\n");
      message.reply(getLang('list', formattedList));
    } else if (action === "unban") {
      if (!args[1]) return;
      await usersData.set(args[1], 0, "data.badwordsmax");
      message.reply(getLang("unban", args[1]));
    }
  },
  atChat: async function({ message, event, threadsData, getLang, api, usersData, role, isAdmin }) {
    if (!isAdmin()) return;
    if (event && !event.body) return;
    const id = event.threadID;
    const statu = await threadsData.get(id, "data.banwordsstatus");
    if (!statu) return;
    
    const tx = event.body.toLowerCase() || event.body;
    const bn = await threadsData.get(event.threadID, "data.badwords") || [];
    const data = await isBadWord(tx, bn);
    const { status, words } = data;
   if (status) {
     const max = await usersData.get(event.senderID, "data.badwordsmax") || 1;
     if (max >= 5) {
       if (role == 2) return message.reply(getLang("badowner"));
       await usersData.set(event.senderID, true, "data.badwordBan");
       api.removeUserFromGroup(event.senderID, id);
       message.reply(getLang("ban", await usersData.getName(event.senderID) || "هذا الكلب"));
       return;
     }
     await usersData.set(event.senderID, max + 1, "data.badwordsmax");
     message.reply(getLang("detected", words.join(","), GB(max), max));
   }
  },
  atEvent: async function({ event, message, usersData, api }) {
    
    if (event.logMessageType == "log:subscribe") {
      const alus = event.logMessageData.addedParticipants;
      for (const user of alus) {
        const { userFbId, fullName } = user;
        const BaN = await usersData.get(userFbId, "data.badwordBan");
        if (BaN) {
      message.reply("لابوبال " + fullName + " 🗿");
api.removeUserFromGroup(userFbId, event.threadID);
        }
      }
    }
  }
};

async function isBadWord(sentence, bn) {
    const lowerSentence = sentence.toLowerCase();
    const lowerBn = bn.map(word => word.toLowerCase());
    const detected = lowerBn.filter(i => lowerSentence.includes(i.toLowerCase()));
    return {
      status: lowerBn.some(word => lowerSentence.includes(word)),
      words: detected || null
}
}


function GB(percentage) {
  const totalSections = 5;
  const filledSections = Math.ceil((percentage / 5) * totalSections);

  const progressBar = `[${'█'.repeat(filledSections)}${'▒'.repeat(totalSections - filledSections)}]`;

  return progressBar;
}