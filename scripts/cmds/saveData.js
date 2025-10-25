const fs = require("fs-extra");

module.exports = {
  config: {
    name: "savedata",
    aliases: ["تخزين"],
    version: "1.2",
    author: "Allou Mohamed",
    countDown: 5,
    role: 2,
    shortDescription: {
      ar: "تخزين بيانات الsqlite في json.",
      en: "save data"
    },
    category: "owner",
    guide: {
      en: "{pn}",
      ar: "{pn}"
    }
  },

  langs: {
    ar: {
      backedUp: "تم حفظ البيانات في scripts/cmds/tmp"
    },
    en: {
      backedUp: "Bot data has been backed up to the scripts/cmds/tmp folder"
    }
  },

  atCall: async function ({ message, getLang, threadsData, usersData, globalData }) {
    const [globalDataBackup, threadsDataBackup, usersDataBackup] = await Promise.all([
      globalData.getAll(),
      threadsData.getAll(),
      usersData.getAll()
    ]);

    const pathThreads = `${__dirname}/tmp/threadsData.json`;
    const pathUsers = `${__dirname}/tmp/usersData.json`;
    const pathGlobal = `${__dirname}/tmp/globalData.json`;

    fs.writeFileSync(pathThreads, JSON.stringify(threadsDataBackup, null, 2));
    fs.writeFileSync(pathUsers, JSON.stringify(usersDataBackup, null, 2));
    fs.writeFileSync(pathGlobal, JSON.stringify(globalDataBackup, null, 2));

    message.reply({
      body: getLang("backedUp"),
      attachment: [
        fs.createReadStream(pathThreads),
        fs.createReadStream(pathUsers),
        fs.createReadStream(pathGlobal)
      ]
    });
  }
};