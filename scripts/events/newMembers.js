module.exports = {
  config: {
    name: "welcome",
    version: "1.0.0",
    countDown: 10,
    author: "allou Mohamed",
    role: 2,
    shortDescription: {
      en: "new members welcome",
      ar: "لترحيب الأعضاء الجدد",
    }    
  },
  langs: {
    en: {
      HI: '📜 | %1',
      Rules: '- Please respect group rules.',
      New: '- New members:',
      bot: "Hi I'm vexa ai.\n• My prefix is %1\n• Don't spam me or i will ban the group."
    },
    ar: {
      HI: '📜 | %1',
      Rules: 'من فضلكم إحترموا القوانين.',
      New: '-أعضاء جدد:',
      bot: "مرحبا أنا فيكسا.\n• الرمز: %1\n• لا تسوي سبام كي لا يبلع الجروب بان هه."
    }
  },
  onRun: async function({ message, event, getLang, usersData, api, threadsData }) {
    const data_ = await threadsData.get(event.threadID, "data.welcome.stt");
    if (event.logMessageType == "log:subscribe") {
    
      let welcome = `${getLang('New')}\n`;
      const added = event.logMessageData.addedParticipants;
      if (added.some((item) => item.userFbId == api.getCurrentUserID())) {
        const prefix = await utils.getPrefix(event.threadID);
        message.reply(getLang("bot", prefix));
        log.info("BOT JOIN NEW GC", event.threadID);
        return;
      }
          if (!data_) return;
      if (await threadsData.get(event.threadID, "data.welcome.text")) {
        let text = await threadsData.get(event.threadID, "data.welcome.text");
        text = text
            .replace(/UN/g, added[0].fullName)
            .replace(/BN/g, await threadsData.getName(event.threadID) || "مستخدمي فيكسا 🤍");
        
        let form = {};
        form.body = text;
        if (await threadsData.get(event.threadID, "data.welcome.attached")) {
          if (await threadsData.get(event.threadID, "data.welcome.attached") == "userPic") {
            form.attachment = await utils.getStreamFromUrl(await usersData.getAvatarUrl(added[0].userFbId));
          } else { 
          form.attachment = await utils.getStreamFromUrl(await threadsData.get(event.threadID, "data.welcome.attached"));
          }
        }
      await message.reply(form);
        return;
      }
      for (let i = 0; i < added.length; i++) {
        welcome += `\n[${i + 1}] | ${added[i].fullName} | ${added[i].userFbId}.`;
      }
      welcome += `\n\n${getLang('Rules')}`;
      
      log.info('Welcome', welcome);
          return message.stream(getLang('HI', welcome), await usersData.getAvatarUrl(event.logMessageData.addedParticipants[0].userFbId));
    }
  }
};
