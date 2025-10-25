module.exports = {
  config: {
    name: "yid",
    aliases: ["آيدي"],
    version: "1.0",
    author: "Allou Mohamed",
    countDown: 10,
    role: 0,          
    shortDescription: {
      ar: "رؤية آيديك",        
      en: "See your progress."         
    },
    category: "status",
    guide: {
      ar: "{pn}",        
      en: "{pn} reply or tag or blank"         
    }
  },

  langs: {
    ar: {
      Yid: "الإسم 『%1 』" +
           "\nالرسائل 『%2 💬』" +
           "\nالرصيد 『%3 💴 』" +
           "\n النقاط 『%4 🎮 』" +
           "\n المستوى 『%5 』" + 
           "\nنقود البنك 『%6 💴』" +
           "\n عدد الرياكشنات 『%7 🎭』" +
           "\n\t\t\t%8"
    },
    en: {
  Yid: "Name: '%1'" +
      "\nMessages: '%2 💬'" +
      "\nBalance: '%3 💴'" +
      "\nPoints: '%4 🎮'" +
      "\nLevel: '%5'" +
      "\nBank Money: '%6 💴'" +
      "\nReactions Count: '%7 🎭'" +
      "\n\t\t\t'%8'"
    }
  },

  atCall: async function ({ args, threadsData, message, event, usersData, getLang }) {
    const uid = event?.messageReply?.senderID || Object.keys(event?. mentions)[0] || event.senderID;
    const tiddata = await threadsData.get(event.threadID);
    const members = tiddata.members;
    const fin = members.find(user => user.userID == uid);
    const count = fin?.count || 0;
    const points = await usersData.getPoints(uid);
    const money = await usersData.getMoney(uid);
    const name = await usersData.getName(uid);
    const bank = 0;//soon
    let deltaNext = 5;
    const expToLevel = (exp, deltaNextLevel = deltaNext) => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNextLevel)) / 2);
    const exp = await usersData.get(uid, "exp");
    const level = expToLevel(exp, deltaNext);
    const reactions = await usersData.get(uid, "data.reactions") || 0;
    const avatar = await usersData.getAvatarUrl(uid);

    let freeFireRank;
    if (points >= 250) {
        freeFireRank = "18 | جراند ماستر 🌟👑";
    } else if (points >= 210) {
        freeFireRank = "17 | ماستر 👑";
    } else if (points >= 190) {
        freeFireRank = "16 | هيرويك 🌟";
    } else if (points >= 170) {
        freeFireRank = "15 | الماس III 💎";
    } else if (points >= 160) {
        freeFireRank = "14 | الماس II 💎";
    } else if (points >= 150) {
        freeFireRank = "13 | الماس 💎";
    } else if (points >= 140) {
        freeFireRank = "12 | بلاتينيوم III 🏆";
    } else if (points >= 130) {
        freeFireRank = "11 | بلاتينيوم II 🏆";
    } else if (points >= 120) {
        freeFireRank = "10 | بلاتينيوم 🏆";
    } else if (points >= 100) {
        freeFireRank = "9 | ذهب III 🥇";
    } else if (points >= 90) {
        freeFireRank = "8 | ذهب II 🥇";
    } else if (points >= 80) {
        freeFireRank = "7 | ذهب 🥇";
    } else if (points >= 70) {
        freeFireRank = "6 | فضي III 🥈";
    } else if (points >= 60) {
        freeFireRank = "5 | فضي II 🥈";
    } else if (points >= 40) {
        freeFireRank = "4 | فضي 🥈";
    } else if (points >= 20) {
        freeFireRank = "3 | برونز III 🥉";
    } else if (points >= 10) {
        freeFireRank = "2 | برونز II 🥉";
    } else if (points >= 5) {
        freeFireRank = "1 | برونز 🥉";
    } else {
        freeFireRank = "0 | مبتدأ 🐢";
    }

    message.stream(getLang("Yid", name, count, money, points, level, bank, reactions, freeFireRank), avatar);
  }
};