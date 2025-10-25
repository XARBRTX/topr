const { commands } = global.VexaBot;

module.exports = {
  config: {
    name: "cmdban",
    aliases: ["حضرامر"],
    version: "1.0",
    author: "alu",
    countDown: 10,
    role: 2,          
    shortDescription: {
      ar: "حضر الأوامر",        
      en: "ban commands in gc"         
    },
    category: "boxchat",
    guide: {
      ar: "{pn} إسم أمر.",        
      en: "{pn} cmdname"         
    }
  },

  atCall: async function ({ args, threadsData, message, event }) {
    if (args[0] == "تصفير") {
      await threadsData.set(event.threadID, {}, "data.setban");
      message.reply("✅ تم وضع التعيين الإفتراضي");
      return;
    }
    if (args[0] == "قائمة") {
      const bans = await threadsData.get(event.threadID, "data.setban") || {};
      const obj = Object.keys(bans);
      if (obj.length < 1) return message.reply("❌ لم تحضر أي أمر");
      let msj = "• قائمة الاوامر المحضورة من قبل المطورين:\n";
      for (let i = 0; i < obj.length; i++) {
        msj += i+1+" "+obj[i]+"\n";
      }
      message.reply(msj);
      return;
    }
    if (args.length < 1) return message.reply("❌لازم تكتب اسم الامر الذي تريد حضره");
    const commandName = args[0];
    const command = global.VexaBot.commands.get(commandName) || (global.VexaBot.aliases.get(commandName) ? global.VexaBot.commands.get(global.VexaBot.aliases.get(commandName).toLowerCase()) : undefined);
    if (!command) return message.reply("❌هذا الامر غير موجود في البوت ");
    if (command.config.role == 2) return message.reply("❌لا يمكنك حضر هذا الأمر لأنهم أصلا ما يقدرو يستعملوه 🌚");
    const cmdN = command.config.name;
    const newBan = (args[1] === 'تم') ? true : false;
    try { 
    const data = await threadsData.get(event.threadID);
    if (!data.data.setban) data.data.setban = {};
    data.data.setban[cmdN] = newBan;
      await threadsData.set(event.threadID, data);
      message.reply("✅ تم جعل إعدادت بان أمر "+cmdN+" :"+newBan);
    } catch(e) {
    message.reply(e.message);
    }
  }
};