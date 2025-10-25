const { getTime } = global.utils;

module.exports = {
  config: {
    name: "group",
    aliases: ["مجموعة"],
    version: "1.4",
    author: "Allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "حضر المستخدمين من المجموعة.",
      en: "Manage group chat"
    },
    category: "owner",
    guide: {
      ar: "   {pn} [find | -f | إيجاد | -s] <إسم المجموعة>: البحث عن مجموعة."
        + "\n   {pn} [find | -f | بحث | -s] [-j | joined] <إسم المجموعة>: إيجاد مجموعة البوت مازال عضو فيها."
        + "\n   {pn} [بان | -b] [<المعرف> | السبب] <reason>: حضر المجموعة"
        + "\n   مثال:"
        + "\n    {pn} بان 3950898668362484 كثرة السب"
        + "\n    {pn} ban سب البوت"
        + "\n\n   {pn} فك [<معرف>] فك البان"
        + "\n   مثل:"
        + "\n    {pn} فك 3950898668362484"
        + "\n    {pn} فك",
      en: "   {pn} [find | -f | search | -s] <name to find>: search group chat in bot data by name"
        + "\n   {pn} [find | -f | search | -s] [-j | joined] <name to find>: search group chat in bot data that bot still joined by name"
        + "\n   {pn} [ban | -b] [<tid> | leave blank] <reason>: use to ban group with id <tid> or current group using bot"
        + "\n   Example:"
        + "\n    {pn} ban 3950898668362484 spam bot"
        + "\n    {pn} ban spam too much"
        + "\n\n   {pn} unban [<tid> | leave blank] to unban group with id <tid> or current group"
        + "\n   Example:"
        + "\n    {pn} unban 3950898668362484"
        + "\n    {pn} unban"
    }
  },

  langs: {
   ar: {
     noPermission: "لا تمتلك الصلاحيات لاستخدام هذه الميزة",
     found: "🔎 تم العثور على %1 مجموعة تطابق كلمة البحث \"%2\" في بيانات الروبوت:\n%3",
     notFound: "❌ لم يتم العثور على أي مجموعة تحمل اسمًا متطابقًا مع كلمة البحث: \"%1\" في بيانات الروبوت",
     hasBanned: "تم حظر المجموعة ذات المعرف [%1 | %2] مسبقًا:\n» السبب: %3\n» الوقت: %4",
     banned: "تم حظر المجموعة ذات المعرف [%1 | %2] من استخدام الروبوت.\n» السبب: %3\n» الوقت: %4",
     notBanned: "حاليًا لا يتم حظر المجموعة ذات المعرف [%1 | %2] من استخدام الروبوت",
     unbanned: "تم رفع الحظر عن المجموعة ذات المعرف [%1 | %2] من استخدام الروبوت",
     missingReason: "لا يمكن ترك سبب الحظر فارغًا",
     info: "» معرف المجموعة: %1\n» الاسم: %2\n» تاريخ إنشاء البيانات: %3\n» إجمالي الأعضاء: %4\n» الذكور: %5 أعضاء\n» الإناث: %6 أعضاء\n» إجمالي الرسائل: %7%8"
        },
    en: {
      noPermission: "You don't have permission to use this feature",
      found: "🔎 Found %1 group matching the keyword \"%2\" in vexa database:\n%3",
      notFound: "❌ No group found matching the keyword: \"%1\" in bot data",
      hasBanned: "Group with id [%1 | %2] has been banned before:\n» Reason: %3\n» Time: %4",
      banned: "Banned group with id [%1 | %2] using bot.\n» Reason: %3\n» Time: %4",
      notBanned: "Group with id [%1 | %2] is not banned using bot",
      unbanned: "Unbanned group with tid [%1 | %2] using bot",
      missingReason: "Ban reason cannot be empty",
      info: "» Box ID: %1\n» Name: %2\n» Date created data: %3\n» Total members: %4\n» Boy: %5 members\n» Girl: %6 members\n» Total messages: %7%8"
    }
  },

  atCall: async function ({ args, threadsData, message, role, event, getLang }) {
    const type = args[0];

    switch (type) {
      // find thread
      case "find":
      case "search":
      case "-f":
      case "بحث": {
        if (role < 2)
          return message.reply(getLang("noPermission"));
        let allThread = await threadsData.getAll();
        let keyword = args.slice(1).join(" ");
        if (['-j', '-join'].includes(args[1])) {
          allThread = allThread.filter(thread => thread.members.some(member => member.userID == global.GoatBot.botID && member.inGroup));
          keyword = args.slice(2).join(" ");
        }
        const result = allThread.filter(item => item.threadID.length > 15 && (item.threadName || "").toLowerCase().includes(keyword.toLowerCase()));
        const resultText = result.reduce((i, thread) => i += `\n╭Name: ${thread.threadName}\n╰ID: ${thread.threadID}`, "");
        let msg = "";
        if (result.length > 0)
          msg += getLang("found", result.length, keyword, resultText);
        else
          msg += getLang("notFound", keyword);
        message.reply(msg);
        break;
      }
      // ban thread
      case "ban":
      case "بان": {
        if (role < 2)
          return message.reply(getLang("noPermission"));
        let tid, reason;
        if (!isNaN(args[1])) {
          tid = args[1];
          reason = args.slice(2).join(" ");
        }
        else {
          tid = event.threadID;
          reason = args.slice(1).join(" ");
        }
        if (!tid)
          return message.SyntaxError();
        if (!reason)
          return message.reply(getLang("missingReason"));
        reason = reason.replace(/\s+/g, ' ');
        const threadData = await threadsData.get(tid);
        const name = threadData.threadName;
        const status = threadData.banned.status;

        if (status)
          return message.reply(getLang("hasBanned", tid, name, threadData.banned.reason, threadData.banned.date));
        const time = getTime("DD/MM/YYYY HH:mm:ss");
        await threadsData.set(tid, {
          banned: {
            status: true,
            reason,
            date: time
          }
        });
        return message.reply(getLang("banned", tid, name, reason, time));
      }
      // unban thread
      case "unban":
      case "فك": {
        if (role < 2)
          return message.reply(getLang("noPermission"));
        let tid;
        if (!isNaN(args[1]))
          tid = args[1];
        else
          tid = event.threadID;
        if (!tid)
          return message.SyntaxError();

        const threadData = await threadsData.get(tid);
        const name = threadData.threadName;
        const status = threadData.banned.status;

        if (!status)
          return message.reply(getLang("notBanned", tid, name));
        await threadsData.set(tid, {
          banned: {}
        });
        return message.reply(getLang("unbanned", tid, name));
      }
      // info thread
      case "info":
      case "معلومات": {
        let tid;
        if (!isNaN(args[1]))
          tid = args[1];
        else
          tid = event.threadID;
        if (!tid)
          return message.SyntaxError();
        const threadData = await threadsData.get(tid);
        const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
        const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
        const totalBoy = valuesMember.filter(item => item.gender == "MALE").length;
        const totalGirl = valuesMember.filter(item => item.gender == "FEMALE").length;
        const totalMessage = valuesMember.reduce((i, item) => i += item.count, 0);
        const infoBanned = threadData.banned.status ?
          `\n- Banned: ${threadData.banned.status}`
          + `\n- Reason: ${threadData.banned.reason}`
          + `\n- Time: ${threadData.banned.date}` :
          "";
        const msg = getLang("info", threadData.threadID, threadData.threadName, createdDate, valuesMember.length, totalBoy, totalGirl, totalMessage, infoBanned);
        return message.reply(msg);
      }
      default:
        return message.err();
    }
  }
};