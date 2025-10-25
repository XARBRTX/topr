module.exports = {
  config: {
    name: "cmdconfig",
    aliases: ["كونفيغ","config"],
    category: "المطور",
    version: "1.0.0",
    author: "allou",
    countDown: 10,
    shortDescription: {
      en: "dev",
      ar: "للمطور"
    },
    guide: {
      en: "/no/",
      ar: "/no/"
    },
    role: 0
  },
  atCall: async function({message, args, role}) {
    
          if (role < 2) return;
          const cmd = `module.exports = {
  config: {
    name: "",
    aliases: [],
    version: "1.0.0",
    author: "",
    countDown: 10,
    shortDescription: {
      en: "",
      ar: ""
    },
    guide: {
      en: "",
      ar: ""
    },
    role: 0
  }
};`;
    
      let func = "";
    
    if (args.length > 0) {
      let pkj = "";
      for (let i = 0; i < args.length; i++) {
        const packageName = args[i];
        if (packageName.startsWith("func:")) {
          const f = packageName.split("func:")[1];
          func += `${f}: async function({}) {},\n`;
        } else {
        pkj += `const ${packageName} = require("${packageName}");\n`;
        }
      }
      return message.reply(pkj + "\n" + `module.exports = {
  config: {
    name: "",
    aliases: [],
    version: "1.0.0",
    author: "",
    countDown: 10,
    shortDescription: {
      en: "",
      ar: ""
    },
    guide: {
      en: "",
      ar: ""
    },
    role: 0
  },
  ${func}
};`);
    }
        message.reply(cmd);
  }
};