const { config } = global.VexaBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "admin",
    aliases: ["أدمن", "ادمن"],
    version: "1.5",
    author: "VexaTeam",
    countDown: 0,
    role: 2,
    shortDescription: {
      ar: "إضافة وإزالة وتفقد صلاحيات المشرفين",
      en: "Add, remove, edit admin role"
    },
    category: "boxchat",
    guide: {
      ar: '   {pn} [اضف | -a] <uid | @tag>: إضافة صلاحيات المشرف للمستخدم'
        + '\n	  {pn} [حذف | -r] <uid | @tag>: إزالة صلاحيات المشرف من المستخدم'
        + '\n	  {pn} [قائمة | -l]: عرض جميع المشرفين',
      en: '   {pn} [add | -a] <uid | @tag>: Add admin role for user'
        + '\n	  {pn} [remove | -r] <uid | @tag>: Remove admin role of user'
        + '\n	  {pn} [list | -l]: List all admins'
    }
  },

  langs: {
    ar: {
      added: "✅ | تمت إضافة صلاحيات المشرف لـ %1 مستخدم:\n%2",
      alreadyAdmin: "\n⚠️ | %1 مستخدم لديهم بالفعل صلاحيات المشرف:\n%2",
      missingIdAdd: "⚠️ | يرجى إدخال معرف أو تاغ للمستخدم لإضافة صلاحيات المشرف",
      removed: "✅ | تمت إزالة صلاحيات المشرف من %1 مستخدم:\n%2",
      notAdmin: "⚠️ | %1 مستخدم ليس لديهم صلاحيات المشرف:\n%2",
      missingIdRemove: "⚠️ | يرجى إدخال معرف أو تاغ للمستخدم لإزالة صلاحيات المشرف",
      listAdmin: "👑 | قائمة المشرفين:\n%1"
    },
    en: {
      added: "✅ | Added admin role for %1 users:\n%2",
      alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
      missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
      removed: "✅ | Removed admin role of %1 users:\n%2",
      notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
      missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
      listAdmin: "👑 | List of admins:\n%1"
    }
  },

  atCall: async function ({ message, args, usersData, event, getLang }) {
    switch (args[0]) {
      case "add":
      case "اضف": {
        if (args[1]) {
          let uids = [];
          if (Object.keys(event.mentions).length > 0)
            uids = Object.keys(event.mentions);
          else if (event.messageReply)
            uids.push(event.messageReply.senderID);
          else
            uids = args.filter(arg => !isNaN(arg));
          const notAdminIds = [];
          const adminIds = [];
          for (const uid of uids) {
            if (config.owners.includes(uid))
              adminIds.push(uid);
            else
              notAdminIds.push(uid);
          }

          config.owners.push(...notAdminIds);
          const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
          writeFileSync(global.VexaBot.dirConfig, JSON.stringify(config, null, 2));
          return message.reply(
            (notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
            + (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
          );
        }
        else
          return message.reply(getLang("missingIdAdd"));
      }
      case "remove":
      case "حذف": {
        if (args[1]) {
          let uids = [];
          if (Object.keys(event.mentions).length > 0)
            uids = Object.keys(event.mentions);
          else
            uids = args.filter(arg => !isNaN(arg));
          const notAdminIds = [];
          const adminIds = [];
          for (const uid of uids) {
            if (config.owners.includes(uid))
              adminIds.push(uid);
            else
              notAdminIds.push(uid);
          }
          for (const uid of adminIds)
            config.owners.splice(config.owners.indexOf(uid), 1);
          const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
          writeFileSync(global.VexaBot.dirConfig, JSON.stringify(config, null, 2));
          return message.reply(
            (adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
            + (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
          );
        }
        else
          return message.reply(getLang("missingIdRemove"));
      }
      case "list":
      case "قائمة": {
        const getNames = await Promise.all(config.owners.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
      }
      default:
        return message.err();
    }
  }
};
