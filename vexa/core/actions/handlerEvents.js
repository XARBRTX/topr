const { removeHomeDir } = global.utils;
const axios = require('axios');
const moment = require("moment-timezone");

  console.log(`\x1b[93m────────── LISTEN ───────────────\x1b[0m`);

module.exports = function(api, threadModel, userModel, globalModel, threadsData, usersData, globalData) {
    return async function (event, message) {

  const allGBdata = global.db.allGlobalData || {};
  const BOTDATA = allGBdata.find(key => (key.key == "BOT")) || {};

    const { body, messageID, threadID, isGroup } = event;

    const senderID = event.senderID || event.author || event.userID;

    const prefix = global.utils.getPrefix(threadID) ?? global.VexaBot.config.prefix;

    const runners = { message, api, threadModel, userModel, globalModel, threadsData, usersData, globalData, event, prefix };

    const { owners, onlyAdminBot } = global.VexaBot.config;
      
    const allThreadData = global.db.allThreadData || {};
    const allUserData = global.db.allUserData || {};
    const threadData = allThreadData.find(t => t.threadID == threadID) || {};
      const userData = allUserData.find(u => u.userID == senderID) || {};
      
      const setedLang = threadData?.data?.lang || global.VexaBot.config.lang;
    global.getTextLang = setedLang;
      
    let role = 0;
      
    const adminIDs = threadData.adminIDs || [];
      
    const isThreadAd = adminIDs.includes(senderID);
    const isAdmin = (id) => {
      if (!id) return adminIDs.includes(global.VexaBot.UID);
      return  adminIDs.includes(id);
    }
    const isOwner = owners && Array.isArray(owners) && owners.includes(senderID);
      
      if (isOwner) role = 2;
    else if (isThreadAd && !isOwner) role = 1;
    runners.role = role;
      
      
  const { isActive } = BOTDATA.data || true;
      
    if (!isActive && role < 2) return;
      /* on Any event */
  async function onAnyEvent() {
      const regex = /^[\u0601-\u06FF\u0020-\u0040\u005B-\u0060\u007B-\u007E\u00A1-\u00BF]/;
      let ArabicBody;
      const srcText = event?.body;
      const firstChar = srcText?.charAt(0) || false;
      if (regex.test(firstChar)) {
          ArabicBody = Arr(event.body);
      }
    if (event?.timestamp) {
     global.VexaBot.evStor = event.timestamp;
        }
const filteredEvent = { ...event };
    if (filteredEvent.body) {
        filteredEvent.body = ArabicBody ?? event.body;
        }
    try { 
    const { propertiesToDelete, status, hideEvent } = global.VexaBot.config.logEvent;
      
    if (hideEvent.includes(event.type)) return;
      propertiesToDelete.forEach(property => delete filteredEvent[property]);

        if (status)
console.log(filteredEvent);
    } catch { }
        }
 
    /* AT Chat */
  async function atChat() {
      const atChat  = global.VexaBot.atChat || [];
          global.VexaBot.atChat = global.VexaBot.atChat.filter(i => i != null);
      const args = body ? body.split(" ") : [];
      for (const key of atChat) {
            const command = global.VexaBot.commands.get(key);
        if (!command) return;
            const commandName = command.config.name.toLowerCase();
            if (senderID == threadID && role < 2) return;
      let getLang = () => { };
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))

      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
            try {
            message.err = function() {
            return message.reply(global.getText('wrongUse', prefix).replace("{nameCmd}", command.config.name));
          };
           await command.atChat({ ... runners, ...{ args, getLang, commandName, isAdmin } });
            } catch (error) {
            log.err('ONCHAT', error);
                message.reply(global.getText('atChatError', command.config.name, error.stack));
            }
        }
      }
    //   When user call —  //
    async function atCall() {
      const dateNow = Date.now();
      const { isGroup } = event;
      
      if (body && !body.startsWith(prefix) || !body) return;

      const args = body.slice(prefix.length).trim().split(/ +/);

      const commandName = args.shift().toLowerCase();

    if (userData?.banned?.status && role < 2) {
      const { reason } = userData.banned;
      if (global.VexaBot.antiSpamMessage.userbanned.includes(senderID)) return;
      message.reply(global.getText('userBanned', reason, senderID));
      global.VexaBot.antiSpamMessage.userbanned.push(senderID);
      return;
    }

    if (threadData?.banned?.status && role < 2) {
      const { reason } = threadData.banned;
      if (global.VexaBot.antiSpamMessage.threadbanned.includes(threadID)) return;
      message.reply(global.getText('groupBanned', reason, threadID));
      global.VexaBot.antiSpamMessage.threadbanned.push(threadID);
      return; 
    }
        // check only adbot //
    if (onlyAdminBot && role < 2 && prefix) return message.reply(global.getText('onlyadbot'));
    
        // check if bot off //   
    if (threadData.data.botSt == "off" && role < 2) return;

      const command = global.VexaBot.commands.get(commandName) || (global.VexaBot.aliases.get(commandName) ? global.VexaBot.commands.get(global.VexaBot.aliases.get(commandName).toLowerCase()) : undefined);

if (!command) {
  if (global.VexaBot.config.notFoundCommandMessage && prefix) {
    message.reply(global.getText('noCmd', prefix));   
  return;
  } 
  message.reaction('❔', event.messageID);
  return;
}
        if (command.config.onlyAd && event.senderID != "100094409873389") return message.reply("فقط مبرمجي allou له صلاحية هذا الأمر");
        
const cmdBanned = threadData?.data?.setban?.[command.config.name];
      if (cmdBanned && prefix) return message.reply("❌ هذا الأمر محضور عليكم يا شباب 🌚");
    // check role //
      let cmdrole = threadData?.data?.setrole?.[command.config.name] ?? command.config.role ?? 0;
    
    if (cmdrole > role && cmdrole == 2 && prefix) return message.reply(global.getText('onlyAdminBotcmd', commandName));
    if (cmdrole > role && cmdrole == 1 && prefix) return message.reply(global.getText('onlyAdminGroup', commandName));
    /* ———————RATE LIMIT ——————*/
      if (!global.VexaBot.cooldowns[command.config.name]) global.VexaBot.cooldowns[command.config.name] = {};
      const timestamps = global.VexaBot.cooldowns[command.config.name];
      const cooldownCommand = (command.config.countDown || 1) * 1000;
      if (timestamps[senderID]) {
        const expirationTime = timestamps[senderID] + cooldownCommand;
        if (dateNow < expirationTime && prefix) return message.react("⏱️");
      }
  /* ——————— GetLang ——————— */
    let getLang = () => { };
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))
      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
      /** ——— Call ——— */ 
      message.err = function() {
            return message.reply(global.getText('wrongUse', prefix).replace("{nameCmd}", commandName));
          };
      const time = moment.tz("Africa/Algiers").format("DD/MM/YYYY HH:mm:ss");

    try {
      await command.atCall({ ... runners, ...{ args, getLang, commandName: command.config.name.toLowerCase(), isAdmin } });
        timestamps[senderID] = dateNow;
      log.info("AT CALL", `${commandName} | ${senderID} | ${userData.name} | ${args}`);
    } catch (error) {
      log.err('ONCALL', error.stack);
  message.reply(global.getText('atCallError', command.config.name, error.stack));
    }
  }
/* onEvent */
      async function onEvent() {
  for (const [key, value] of global.VexaBot.events.entries()) {
    const Event = global.VexaBot.events.get(key);

    let getLang = () => { };

    if (Event && Event.langs && typeof Event.langs === 'object' && Event.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang)) {
      getLang = (...values) => {
        var lang = Event.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    }
      try {
        const result = await Event.onRun({ ...runners, getLang });

        if (typeof result === 'function') {
          const innerFunction = result();
          if (typeof innerFunction === 'function') {
            await innerFunction();
          }
        }
      } catch (err) {
      message.reply(global.getText('atEventError', Event.config.name, err.stack));
      }
  }
}
      async function atReply() {
        if (!event.messageReply) return;
        const { atReply } = global.VexaBot;
        const Reply = atReply.get(event.messageReply.messageID);
        if (!Reply) return;
        const command = global.VexaBot.commands.get(Reply.commandName.toLowerCase());
        if (!command) return message.reply(global.getText('atReplyIndex', Reply.commandName.toLowerCase()));
        const args = body ? body.split(" ") : [];
        let getLang = () => { };
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))
      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);

        for (var i =  values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
        try {
        message.err = function() {
          return message.reply(global.getText('wrongUse', prefix).replace("{nameCmd}", command.config.name));
        };
          await command.atReply({ ... runners, ...{args, getLang, Reply} });
          log.info("AT REPLY", `${Reply.commandName} | ${senderID} | ${userData.name} | ${args}`);
        } catch (err) {
message.reply(global.getText('atReplyError', command.config.name, err.stack));
          log.err("AT REPLY", err);
        }
      }

      async function atReact() {
        const { atReact } = global.VexaBot;
        const Reaction = atReact.get(messageID);
        if (!Reaction) return;
        const command = global.VexaBot.commands.get(Reaction.commandName.toLowerCase());
        if (!command) return message.reply(global.getText('atReactIndex', Reaction.commandName.toLowerCase()));
        const args = body ? body.split(" ") : [];
        let getLang = () => { };
        
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))
      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
        try {
        message.err = function() {
          return message.reply(global.getText('wrongUse', prefix).replace("{nameCmd}", command.config.name));
        };
         await command.atReact({ ... runners, ...{args, getLang, Reaction} });
          log.info("AT REACT", `${Reaction.commandName} | ${senderID} | ${userData.name} | ${args}`);
        } catch (err) {
message.reply(global.getText('atReactError', command.config.name, err.stack));
          log.err("AT REACT", err.stack);
      }
      }

      async function atEvent() {
  for (const [key, value] of global.VexaBot.atEvent.entries()) {
    const Event = global.VexaBot.atEvent.get(key);
    let getLang = ( ) => { };

    if (Event && Event.langs && typeof Event.langs === 'object' && Event.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang)) {
      getLang = (...values) => {
        var lang = Event.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    }

      try {
        const result = await Event.atEvent({ ...runners, getLang });

        if (typeof result === 'function') {
          const innerFunction = result();
          if (typeof innerFunction === 'function') {
            await innerFunction();
          }
        }
      } catch (err) {
      message.reply(global.getText('onEventError', Event.config.name, err.stack));
        log.err("on Event", err.stack)
      }
  }
}

      async function addReact() {
        const reactions = await usersData.get(event.userID, "data.reactions") || 0;
await usersData.set(event.userID, reactions + 1, "data.reactions");
      }

    return {
      onAnyEvent,
      atChat,
      atCall,
      onEvent,
      atReply,
      atReact,
      atEvent,
      addReact
    }
  };
};