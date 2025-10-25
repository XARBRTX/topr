const { flags } = require(__dirname + "/fakegamesapi/index.js");

module.exports = {
  config: {
    name: "QSF",
    aliases: ["علم"],
    version: "1.0",
    author: "Allou Mohamed",
    countDown: 10,
    role: 0,          
    shortDescription: {
      ar: "الحصول على علم",        
      en: "Arabic game flags"         
    },
    category: "games",
    guide: {
      ar: "{pn}",        
      en: "{pn}"         
    }
  },

  atCall: async function ({ args, message, event, usersData }) {
    const quiz = await flags();
    const {a, b} = quiz;
    message.stream("ما هذا العلم ؟", b);
    global.VexaBot.onListen.set(await utils.randomString(8), {
      condition: `event.body == "${a}"`,
      result: `async () => {
      await message.reply('صحيح لقد ربحت 100 عملة | ✅');
      await usersData.addMoney(event.senderID, 100);
      }`
    });
  }
};