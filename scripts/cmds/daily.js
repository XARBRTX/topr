const moment = require("moment-timezone");
module.exports = {
  config: {
    name: "daily",
    aliases: ["هدية"],
    version: "1.1",
    author: "Allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "استلام هدية يومية",
      en: "Receive daily gift"
    },
    category: "game",
    guide: {
      ar: "   {pn}: استلام هدية يومية"
        + "\n   {pn} info: عرض معلومات الهدية اليومية",
      en: "   {pn}"
        + "\n   {pn} info: View daily gift information"
    }
  },

  langs: {
    ar: {
      monday: "الإثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
      alreadyReceived: "لقد استلمت الهدية بالفعل.",
      received: "لقد استلمت %1 عملة و %2 نقطة."
    },
    en: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      alreadyReceived: "You have already received the gift",
      received: "You have received %1 coin and %2 exp"
    }
  },

  atCall: async function ({ args, message, event, usersData, commandName, getLang }) {
    const daily = { 
      rewardFirstDay: {
        coin: 100,
        exp: 10
    }
  };
    const reward = daily.rewardFirstDay;
    if (args[0] == "info" || args[0] == "معلومات") {
      let msg = "";
      for (let i = 1; i < 8; i++) {
        const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
        const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
        const day = i == 7 ? getLang("sunday") :
          i == 6 ? getLang("saturday") :
            i == 5 ? getLang("friday") :
              i == 4 ? getLang("thursday") :
                i == 3 ? getLang("wednesday") :
                  i == 2 ? getLang("tuesday") :
                    getLang("monday");
        msg += `${day}: ${getCoin} عملة، ${getExp} نقطة\n`;
      }
      return message.reply(msg);
    }

    const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
    const date = new Date();
    const currentDay = date.getDay(); // 0: sunday, 1: monday, 2: tuesday, 3: wednesday, 4: thursday, 5: friday, 6: saturday
    const { senderID } = event;

    const userData = await usersData.get(senderID);
    if (userData.data.lastTimeGetReward === dateTime)
      return message.reply(getLang("alreadyReceived"));

    const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((currentDay == 0 ? 7 : currentDay) - 1));
    const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((currentDay == 0 ? 7 : currentDay) - 1));
    userData.data.lastTimeGetReward = dateTime;
    await usersData.set(senderID, {
      money: userData.money + getCoin,
      exp: userData.exp + getExp,
      data: userData.data
    });
    message.reply(getLang("received", getCoin, getExp));
  }
};
