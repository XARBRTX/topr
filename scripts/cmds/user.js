module.exports = {
  config: {
    name: "user",
    aliases: ["مستخدم"],
    version: "1.0",
    author: "Vexa Team",
    countDown: 5,
    role: 2,
    shortDescription: {
      ar: "حضر المستخدمين.",
      en: "Manage Users Ban And Unban"
    },
    category: "Admin",
    guide: {
      ar: "{pn} <ban | unban | info >",
      en: "{pn} <ban | unban | info >"
    }
  },

  langs: {
    ar: {
      ban: "- تم حضر %1 بسبب %3.\n# %2.",
      unban: "- تم فك البان عن %1.\n# %2.",
      needReason: "لمذا تريد حضره ؟ أدخل السبب.",
      goodppl: "لم يتم حضره من قبل.",
      info: "• معلومات:\n%1",
      badppl: "• لقد تم حضره من إستخدام البوت من قبل.",
      noUserFound: "❌ لا يوجد أي مستخدم بإسم يشبه: \"%1\" في البيانات.",
			userFound: "🔎 وجدت %1 أشخاص بإسم يشبه \"%2\" في البيانات:\n%3"
    },
    en: {
      ban: "- Banned:\nUser: %1\nUID: %2\nReason: %3.",
      unban: "- Unbanned user %1.\nUID: %2.",
      needReason: "Reason to ban a user cannot be empty, please enter uid or tag or reply message of 1 user by user ban <uid> <reason>",
      goodppl: "Not banned before.",
      info: "Info: %1",
      badppl: "Be careful he got a ban before.",
      noUserFound: "❌ No user found with name matching keyword: \"%1\" in bot data",
			userFound: "🔎 Found %1 user with name matching keyword \"%2\" in vexa database:\n%3"
    }
  },

  atCall: async function ({ args, message, event, usersData, role, getLang }) {
    const action = args[0];
    let id;
    switch (action) {
      case "ban":
      case "بان":
        if (event.type == "message_reply") {
          if (!args[1]) return message.reply(getLang('needReason'));
          const data = args.join(' ').split(args[0]);
          const bcz = data[1];
          id = event.messageReply.senderID;
          await usersData.set(id, true, "banned.status");
          await usersData.set(id, bcz, "banned.reason");
          message.reply(getLang('ban', await usersData.getName(id), id, bcz));
        } else {
          id = args[1];
          if (!args[2]) return message.reply(getLang('needReason'));
          const data = args.join(' ').split(args[1]);
          const bcz = data[1];
          await usersData.set(id, true, "banned.status");
          await usersData.set(id, bcz, "banned.reason");
message.reply(getLang('ban', await usersData.getName(id), id, bcz));
        }
        break;
      case "unban":
      case "فك":
        if (event.type == "message_reply") {
          id = event.messageReply.senderID;
          await usersData.set(id, false, "banned.status");
          await usersData.set(id, "Banned before 🚫", "banned.reason");
          message.reply(getLang('unban', await usersData.getName(id), id));
        } else {
          id = args[1];
          await usersData.set(id, false, "banned.status");
          await usersData.set(id, "BANNED BEFORE 🚫", "banned.reason");
message.reply(getLang('unban', await usersData.getName(id), id));
        }
        break;
      case "info":
      case "معلومات":
        if (!args[1] && event.type == "message_reply") { 
          id = event.messageReply.senderID;
        } else {
          id = args[1] || event.senderID;
        }
        const info = await usersData.get(id);
        let text = `- ${info.name}:\n•Uid: ${id}\n\n`;
        if (info.banned.reason) {
          text += getLang("badppl");
        } else {
          text += getLang("goodppl");
        }
        message.reply(getLang('info', text));
        break;
      case "find":
      case "بحث":
        const allUser = await usersData.getAll();
				const keyWord = args.slice(1).join(" ");
				const result = allUser.filter(item => (item.name || "").toLowerCase().includes(keyWord.toLowerCase()));
				const msg = result.reduce((i, user) => i += `\n╭Name: ${user.name}\n╰ID: ${user.userID}`, "");
				message.reply(result.length == 0 ? getLang("noUserFound", keyWord) : getLang("userFound", result.length, keyWord, msg));
        break;
      default:
        message.err();
        break;
    }
  }
};