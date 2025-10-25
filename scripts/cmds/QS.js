const { QS } = require(__dirname + "/fakegamesapi/index.js");

module.exports = {
  config: {
    name: "QS",
    aliases: ["حزورة"],
    version: "1.0",
    author: "Allou Mohamed",
    countDown: 10,
    role: 0,          
    shortDescription: {
      ar: "الحصول على حزورة",        
      en: "Arabic game quiz"         
    },
    category: "games",
    guide: {
      ar: "{pn}",        
      en: "{pn}"         
    }
  },

  atCall: async function ({ args, message, event, usersData }) {
    const quiz = await QS();
    const {a, b} = quiz;
    message.reply(a);
    global.VexaBot.onListen.set(await utils.randomString(8), {
      condition: `event.body == "${b}"`,
      result: `async () => {
      await message.reply('صحيح لقد ربحت 50 عملة | ✅');
      await usersData.addMoney(event.senderID, 50);
      }`
    });
  }
};