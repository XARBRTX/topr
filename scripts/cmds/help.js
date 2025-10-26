const { getPrefix } = global.utils;
const { commands } = global.VexaBot;
const doNotDelete = "يوكي بوت 1.0.0";
const { getStreamFromUrl } = global.utils;
function compareCommands(command1, command2) {
  const name1 = command1.config.name.toLowerCase();
  const name2 = command2.config.name.toLowerCase();

  return name1.localeCompare(name2, ["ar", "en"], { sensitivity: "base" });
}

module.exports = {
  config: {
    name: "help",
    aliases: ["الأوامر", "الاوامر", "اوامر", "مساعدة", "أوامر"],
    version: "1.17",
    author: "Allou Mohamed",
    role: 0,
    shortDescription: "عرض أوامر البوت",
    category: "المعلومات",
  },
  langs: {
    ar: {
      help: "📝 | أوامر البوت مع الوصف\n───────────────\n%1\n──────────────\n• عدد الأوامر: %2\n• الصفحة: %3\n• %4\n• لعرض أوامر فئة معينة أكتب الفئة بدلا من رقم الصفحة"
    },
      en: {
         help: "%1\n%2 CMD\n%3\nprefix: %4"
      }
  },
  atCall: async function ({ message, args, event, getLang, threadsData }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const gc = await threadsData.get(event.threadID);
    const lang = gc?.data?.lang || global.VexaBot.config.lang;
    const pageSize = 30;
    const pageNumber = args[0] ? parseInt(args[0]) : 1; 
    if (isNaN(pageNumber)) {
      const categoryFilter = args[0];

      const commandsInCategory = Array.from(commands.values())
        .filter(command => command.config.category.toLowerCase() === categoryFilter)
        .sort(compareCommands)
        .map((command) => {
          let description = command.config.description || (typeof command.config.shortDescription === 'string' ? command.config.shortDescription : '');

          if (typeof command.config.shortDescription === 'object' && command.config.shortDescription[lang]) {
            description = command.config.shortDescription[lang];
          }

          return `${prefix}${command.config.name} - ${description}`;
        })
        .join("\n");

      if (commandsInCategory) {
        message.reply({body: `────────────────\n              🔱  ${categoryFilter} 🔱\n────────────────\n${commandsInCategory}\n────────────────\n              🔱 ${categoryFilter} 🔱\n────────────────`, attachment: await getStreamFromUrl('https://i.ibb.co/V3j3vct/370328955-2037327609972647-318502366165490462-n-jpg-nc-cat-107-ccb-1-7-nc-sid-8cd0a2-nc-eui2-Ae-G0-K.jpg')});
        return;
      } else {
        message.reply(`لا توجد أوامر ${args[0]} جرب أوامر الألعاب 🌝`);
        return;
      }
    };

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const totalCommands = commands.size;

    if (startIndex >= totalCommands || startIndex < 0) {
      message.reply("الصفحة غير موجودة 🐢🤍.");
      return;
    }

    const sortedCommands = Array.from(commands.values())
      .sort(compareCommands)
      .slice(startIndex, endIndex)
      .map((command, index) => {
        const commandNumber = startIndex + index + 1; 
        let description = command.config.description || (typeof command.config.shortDescription === 'string' ? command.config.shortDescription : '');
        
        if (typeof command.config.shortDescription === 'object' && command.config.shortDescription[lang]) {
          description = command.config.shortDescription[lang];
        }
       if (lang == "ar") {
        return `${commandNumber} | ${prefix}${command?.config?.aliases?.[0] || command.config.name} - ${description}`;
           } else {
         return `${commandNumber} | ${prefix}${command.config.name} - ${description}`;
           }
      })
      .join("\n");

    message.reply({ body: getLang('help', sortedCommands, totalCommands, pageNumber, doNotDelete), attachment: await getStreamFromUrl('https://files.catbox.moe/s3z9dm.jpg')});
  },
};
