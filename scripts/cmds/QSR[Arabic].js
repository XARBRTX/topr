const { QSR } = require(__dirname + "/fakegamesapi/index.js");

module.exports = {
  config: {
    name: "Adams",
    aliases: ["مغامرة"],
    version: "1.0",
    author: "Allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "game Adams.",
      ar: "مغامرة في منزل العائلة آدمز"
    },
    category: "الألعاب"
  },

  atCall: async function({ event, message, commandName }) {
    const uid = event.senderID;
    const res = await QSR(uid);
    return message.reply(res.message, (err, info) => {
      global.VexaBot.atReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mid: info.messageID
      })
    });
  },
  atReply: async function({ message, event, args, Reply }) {
    const { mid, author, commandName } = Reply;
    const uid = event.senderID;
    if (uid != author) return message.reply('أنت لست لاعب القصة');
    const ans = {"1": "A", "2": "B", "3": "C"};
    const answer = ans[args[0]];
    const res = await QSR(uid, answer);
    
    message.unsend(mid);
    return message.reply(res.message, (err, info) => {
      if (res.end) return global.VexaBot.atReply.delete(mid);
      global.VexaBot.atReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mid: info.messageID
      })
    });
  }
  };