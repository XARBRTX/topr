module.exports = {
  config: {
    name: "count",
    aliases: ["رسائل", "حساب"],
    version: "1.2",
    author: "VexaTeam",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "رؤية عدد رسائلك و ترتيبك.",
      en: "View group messages"
    },
    category: "المجموعة",
    guide: {
      ar: "   {pn}: رؤية عدد رسائلك"
        + "\n   {pn} @تاغ: رؤية عدد رسائل العضو"
        + "\n   {pn} all: رؤية قائمة للكل.",
      en: "   {pn}: used to view the number of messages of you"
        + "\n   {pn} @tag: used to view the number of messages of those tagged"
        + "\n   {pn} all: used to view the number of messages of all members"
    }
  },

  langs: {
    ar: {
      count: "✅ تم جلب النتائج:\n",
      endMessage: "من لم يضهر إسمه لم يرسل أي رسالة.",
      page: "الصفحة [%1/%2]",
      reply: "رد على الرسالة برقم الصفحة لرؤية المزيد",
      result: "%1:\n• ترتيبه %2 و عدد رسائله %3.",
      yourResult: "أنت ترتيبك %1 وعدد رسائلك %2 رسالة.",
      invalidPage: "ليس رقم صفحة صحيح."
    },
    en: {
      count: "Number of messages of members:\n",
      endMessage: "Those who do not have a name in the list have not sent any messages.",
      page: "Page [%1/%2]",
      reply: "Reply to this message with the page number to view more",
      result: "%1 rank %2 with %3 messages",
      yourResult: "You are ranked %1 and have sent %2 messages in this group",
      invalidPage: "Invalid page number"
    }
  },

  atCall: async function ({ args, threadsData, message, event, api, commandName, getLang }) {
    const { threadID, senderID } = event;
    const threadData = await threadsData.get(threadID);
    const { members } = threadData;
    const usersInGroup = (await api.getThreadInfo(threadID)).participantIDs;
    let arraySort = [];
    for (const user of members) {
      if (!usersInGroup.includes(user.userID))
        continue;
      if (!user.name) continue;
      const charac = "️️️️️️️️️️️️️️️️️"; 
      arraySort.push({
        name: user?.name?.includes(charac) ? `Uid: ${user.userID}` : user.name,
        count: user.count,
        uid: user.userID
      });
    }
    let stt = 1;
    arraySort.sort((a, b) => b.count - a.count);
    arraySort.map(item => item.stt = stt++);
   try {
    if (args[0]) {
      if (args[0].toLowerCase() == "all" || args[0] == "الكل") {
        let msg = getLang("count");
        const endMessage = getLang("endMessage");
        for (const item of arraySort) {
          if (item.count > 0)
            msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
        }

        if ((msg + endMessage).length > 19999) {
          msg = "";
          let page = parseInt(args[1]);
          if (isNaN(page))
            page = 1;
          const splitPage = global.utils.splitPage(arraySort, 50);
          arraySort = splitPage.allPage[page - 1];
          for (const item of arraySort) {
            if (item.count > 0)
              msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
          }
          msg += getLang("page", page, splitPage.totalPage)
            + `\n${getLang("reply")}`
            + `\n\n${endMessage}`;

          return message.reply(msg, (err, info) => {
            if (err)
              return message.error(err);
            global.VexaBot.atReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              splitPage,
              author: senderID
            });
          });
        }
        msg += `\n\n${endMessage}`;
        message.reply(msg);
      }
      else if (event.mentions) {
        let msg = "";
        for (const id in event.mentions) {
          const findUser = arraySort.find(item => item.uid == id);
          msg += `\n${getLang("result", findUser.name, findUser.stt, findUser.count)}`;
        }
        message.reply(msg);
      }
    }
    else {
      const findUser = arraySort.find(item => item.uid == senderID);
      return message.reply(getLang("yourResult", findUser.stt, findUser.count));
    }
   } catch (e) {
       await threadsData.refreshInfo(event.threadID);
   }
  },

  atReply: ({ message, event, Reply, getLang }) => {
    const { senderID, body, commandName } = event;
    const { author, splitPage } = Reply;
    if (author != senderID)
      return;
    const page = parseInt(body);
    if (isNaN(page) || page < 1 || page > splitPage.totalPage)
      return message.reply(getLang("invalidPage"));
    let msg = getLang("count");
    const endMessage = getLang("endMessage");
    const arraySort = splitPage.allPage[page - 1];
    for (const item of arraySort) {
      if (item.count > 0)
        msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
    }
    msg += getLang("page", page, splitPage.totalPage)
      + "\n" + getLang("reply")
      + "\n\n" + endMessage;
    message.reply(msg, (err, info) => {
      if (err)
        return message.error(err);
      message.unsend(Reply.messageID);
      global.VexaBot.atReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        splitPage,
        author: senderID
      });
    });
  },

  atChat: async ({ usersData, threadsData, event }) => {
    const { senderID, threadID } = event;
    const members = await threadsData.get(threadID, "members");
    const findMember = members.find(user => user.userID == senderID);
    if (!findMember) {
      members.push({
        userID: senderID,
        name: await usersData.getName(senderID),
        nickname: null,
        inGroup: true,
        count: 1
      });
    }
    else
      findMember.count += 1;
    await threadsData.set(threadID, members, "members");
  }
};