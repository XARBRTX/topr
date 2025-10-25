module.exports = {
  config: {
    name: "refresh",
    aliases: ["تحديث"],
    version: "1.1",
    author: "Allou Mohamed",
    countDown: 60,
    role: 0,
    shortDescription: {
      ar: "تحديث المعلومات.",
      en: "refresh information"
    },
    category: "boxchat",
    guide: {
      ar: "   {pn} [المجموعة | الأعضاء]: تحديث المجموعة أو عضو ما."
        + "\n   {pn} المجموعة <المعرف>: تحديث المجموعة التي وضعت معرفها"
        + "\n\n   {pn} user: تحديث معلومات مستخدمك"
        + "\n   {pn} user [<userID> | @tag]: تحديث معلومات مستخدم بناءً على الهوية",
      en: "   {pn} [thread | group]: refresh information of your group chat"
        + "\n   {pn} group <threadID>: refresh information of group chat by ID"
        + "\n\n   {pn} user: refresh information of your user"
        + "\n   {pn} user [<userID> | @tag]: refresh information of user by ID"
    }
  },

  langs: {
    ar: {
      refreshMyThreadSuccess: "✅ | تحديث معلومات مجموعة الدردشة الخاصة بك بنجاح!",
      refreshThreadTargetSuccess: "✅ | تحديث معلومات مجموعة الدردشة %1 بنجاح!",
      errorRefreshMyThread: "❌ | حدث خطأ عند تحديث معلومات مجموعة الدردشة الخاصة بك",
      errorRefreshThreadTarget: "❌ | حدث خطأ عند تحديث معلومات مجموعة الدردشة %1",
      refreshMyUserSuccess: "✅ | تحديث معلومات مستخدمك بنجاح!",
      refreshUserTargetSuccess: "✅ | تحديث معلومات المستخدم %1 بنجاح!",
      errorRefreshMyUser: "❌ | حدث خطأ عند تحديث معلومات مستخدمك",
      errorRefreshUserTarget: "❌ | حدث خطأ عند تحديث معلومات المستخدم %1"
    },
    en: {
      refreshMyThreadSuccess: "✅ | Refresh information of your group chat successfully!",
      refreshThreadTargetSuccess: "✅ | Refresh information of group chat %1 successfully!",
      errorRefreshMyThread: "❌ | Error when refresh information of your group chat",
      errorRefreshThreadTarget: "❌ | Error when refresh information of group chat %1",
      refreshMyUserSuccess: "✅ | Refresh information of your user successfully!",
      refreshUserTargetSuccess: "✅ | Refresh information of user %1 successfully!",
      errorRefreshMyUser: "❌ | Error when refresh information of your user",
      errorRefreshUserTarget: "❌ | Error when refresh information of user %1"
    }
  },

  atCall: async function ({ args, threadsData, message, event, usersData, getLang }) {
    if (args[0] == "group" || args[0] == "المجموعة") {
      const targetID = args[1] || event.threadID;
      try {
        await threadsData.refreshInfo(targetID);
        return message.reply(targetID == event.threadID ? getLang("refreshMyThreadSuccess") : getLang("refreshThreadTargetSuccess", targetID));
      }
      catch (error) {
        return message.reply(targetID == event.threadID ? getLang("errorRefreshMyThread") : getLang("errorRefreshThreadTarget", targetID));
      }
    }
    else if (args[0] == "user" || args[0] == "المستخدم") {
      let targetID = event.senderID;
      if (args[1]) {
        if (Object.keys(event.mentions).length)
          targetID = Object.keys(event.mentions)[0];
        else
          targetID = args[1];
      }
      try {
        await usersData.refreshInfo(targetID);
        return message.reply(targetID == event.senderID ? getLang("refreshMyUserSuccess") : getLang("refreshUserTargetSuccess", targetID));
      }
      catch (error) {
        return message.reply(targetID == event.senderID ? getLang("errorRefreshMyUser") : getLang("errorRefreshUserTarget", targetID));
      }
    }
    else
      message.err();
  }
};
