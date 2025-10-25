const { commands } = global.VexaBot;

module.exports = {
  config: {
    name: "setrole",
    aliases: ["صلاحية"],
    version: "1.0",
    author: "alu",
    countDown: 10,
    role: 1,          
    shortDescription: {
      ar: "تعديل صلاحية الاوامر",        
      en: "change cmds role"         
    },
    category: "boxchat",
    guide: {
      ar: "{pn} إسم أمر ثم صلاحية مثل:\n{pn} طرد 2",        
      en: "{pn} cmdname newRole 0 1 2."         
    }
  },

  atCall: async function ({ args, threadsData, message, event, role }) {
    if (args[0] == "تصفير") {
      await threadsData.set(event.threadID, {}, "data.setrole");
      message.reply("✅ تم وضع التعيين الإفتراضي");
      return;
    }
    if (args[0] == "قائمة") {
      const roles = await threadsData.get(event.threadID, "data.setrole") || {};
      const obj = Object.keys(roles);
      if (obj.length < 1) return message.reply("❌ لم تعدلو اي رول");
      let msj = "• قائمة الرولات:\n";
      for (let i = 0; i < obj.length; i++) {
        msj += i+1+" "+obj[i]+": "+roles[obj[i]]+"\n";
      }
      message.reply(msj);
      return;
    }
    if (args.length < 2) return message.reply("❌لازم تكتب اسم الامر و الرول الجديد");
    if (isNaN(parseInt(args[1]))) return message.reply("❌الرول هو ثاني شي تدخله و لازم يكون رقم");
    const commandName = args[0];
    const command = global.VexaBot.commands.get(commandName) || (global.VexaBot.aliases.get(commandName) ? global.VexaBot.commands.get(global.VexaBot.aliases.get(commandName).toLowerCase()) : undefined);
    if (!command) return message.reply("❌هذا الامر غير موجود في البوت ");
    if (command.config.role == 2 && role < 2) return message.reply("❌لا يمكنك تغيير رول هذا الأمر");
    const cmdN = command.config.name;
    const newRole = parseInt(args[1]);
    try { 
    const data = await threadsData.get(event.threadID);
    if (!data.data.setrole) data.data.setrole = {};
    data.data.setrole[cmdN] = newRole;
      await threadsData.set(event.threadID, data);
      message.reply("✅ تم تغيير رول أمر "+cmdN+" إلى "+newRole+"");
    } catch(e) {
    message.reply(e.message);
    }
  }
};