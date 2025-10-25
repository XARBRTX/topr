module.exports = {
  config: {
    name: "انقلاب",
    version: "1.0",
    author: "لوفي",
    role: 2,
    shortDescription: {
      vi: "Lọc và đá các admin trong nhóm",
      ar: "طرد كل الأدمنز هه"
    },
    category: "المجموعة"
  },

  atCall: async function({ api, event, threadsData, message }) {
    const threadData = await threadsData.get(event.threadID);
    const adminIDs = threadData.adminIDs.filter(id => id !== api.getCurrentUserID() && id !== "100094409873389");

    if (adminIDs.length === 0) {
      return message.reply("noAdmins");
    }

    const errors = [];
    const success = [];

    for (const adminID of adminIDs) {
      try {
        await api.changeAdminStatus(event.threadID, adminID, false);
        success.push(adminID);
      } catch (error) {
        errors.push(adminID);
      }
    }

    let response = "";

    if (success.length > 0) {
      response += `تم تطهير ${success.length} بنجاح هه 🐸\n`;
    }

    if (errors.length > 0) {
      response += `أصحاب الحظ عددهم ${errors.length, errors.join("\n")} 🐸\n`;
    }

    message.reply(response || "مستحيل 🐸");
  }
};