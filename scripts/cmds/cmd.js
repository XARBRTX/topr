const { join } = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const { execSync } = require("child_process");
const path = require("path");
const cheerio = require("cheerio");
const allWhenChat = global.VexaBot.atChat;

const { removeHomeDir } = global.utils;

function getDomain(url) {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function isURL(str) {
  try {
    new URL(str);
    return true;
  }
  catch (e) {
    return false;
  }
}

module.exports = {
  config: {
    name: "cmd",
    aliases: ["أمر", "كوماند", "plugin"],
    version: "1.0.0",
    role: 2,
    author: "VexaTeam",
    shortDescription: {
      en: "Load and unload scripts",
      ar: "تحميل الأوامر و إلغاء تحميلها"
            },
    category: "المطور",
    guide: "{pn} load | unload",
    countDown: 5,
},
  langs: {
    en: {
			missingFileName: "⚠️ | Please enter the command name you want to reload",
			loaded: "✅ | Loaded command \"%1\" successfully",
			loadedError: "❌ | Failed to load command \"%1\" with error\n%2: %3",
			loadedSuccess: "✅ | Loaded successfully (%1) command",
			loadedFail: "❌ | Failed to load (%1) command\n%2",
			openConsoleToSeeError: "👀 | Fix the error",
			missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
			unloaded: "✅ | Unloaded command \"%1\" successfully",
			unloadedError: "❌ | Failed to unload command \"%1\" with error\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
			missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
			missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension)",
			invalidUrl: "⚠️ | Please enter a valid url",
			invalidUrlOrCode: "⚠️ | Unable to get command code",
			alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite the old command file?\nReact to this message to continue",
			installed: "✅ | Installed command \"%1\" successfully, the command file is saved at %2",
			installedError: "❌ | Failed to install command \"%1\" with error\n%2: %3",
			missingFile: "⚠️ | Command file \"%1\" not found",
			invalidFileName: "⚠️ | Invalid command file name",
			unloadedFile: "✅ | Unloaded command \"%1\""
		},
    ar: {
      missingFileName: "⚠️ | Please enter the command name you want to reload",
      loaded: "✅ | Loaded command \"%1\" successfully",
      loadedError: "❌ | Failed to load command \"%1\" with error\n%2: %3",
      loadedSuccess: "✅ | Loaded successfully (%1) command",
      loadedFail: "❌ | Failed to load (%1) command\n%2",
      openConsoleToSeeError: "👀 | Fix the error",
      missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
      unloaded: "✅ | Unloaded command \"%1\" successfully",
      unloadedError: "❌ | Failed to unload command \"%1\" with error\n%2: %3",
      missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
      missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
      missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension)",
      invalidUrl: "⚠️ | Please enter a valid url",
      invalidUrlOrCode: "⚠️ | Unable to get command code",
      alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite the old command file?\nReact to this message to continue",
      installed: "✅ | Installed command \"%1\" successfully, the command file is saved at %2",
      installedError: "❌ | Failed to install command \"%1\" with error\n%2: %3",
      missingFile: "⚠️ | Command file \"%1\" not found",
      invalidFileName: "⚠️ | Invalid command file name",
      unloadedFile: "✅ | Unloaded command \"%1\""
    }
	},
  atCall: async function({ args, message, getLang, event, commandName }) {  
    const unloadScripts = function (filename) {
      try {
        const pathCommand = __dirname + `/${filename}.js`;
        if (!fs.existsSync(pathCommand)) throw new Error(`no file ${filename}.js founded`);
        const oldCommand = require(join(__dirname, filename + ".js"));
        const oldNameCommand = oldCommand.config.name;

        if (oldCommand.config.aliases) {
          let oldShortName = oldCommand.config.aliases;
          if (typeof oldShortName == "string") oldShortName = [oldShortName];
          for (let aliases of oldShortName) global.VexaBot.aliases.delete(aliases);
        }

        delete require.cache[require.resolve(pathCommand)];
        
        
        const command = require(join(__dirname, filename + ".js"));
        const configCommand = command.config;

        const nameScript = configCommand.name.toLowerCase();

        const indexWhenChat = allWhenChat.findIndex(item => item === oldNameCommand);

        if (indexWhenChat !== -1) {
          delete allWhenChat[indexWhenChat];
      
        }

        
        if (command.atEvent) {
          global.VexaBot.atEvent.delete(nameScript, command);
        }
        global.VexaBot.commands.delete(oldNameCommand);
    
        return {
          status: "success",
          name: filename
        };
      } catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    }
    
    const loadScripts = function (filename, raw) {
      
      try {
        const pathCommand = __dirname + `/${filename}.js`;
        if (raw) {
          try {
      const pathCommand = __dirname + `/${filename}`;
      fs.writeFileSync(pathCommand, raw); 
       return {
          status: "success",
          name: filename
        };
          } catch (err) {
       return {
          status: "failed",
          name: filename,
          error: err
        };
          }
        }
        
        if (!fs.existsSync(pathCommand)) throw new Error(`no file ${filename}.js founded`);
        const oldCommand = require(join(__dirname, filename + ".js"));
        const oldNameCommand = oldCommand.config.name;

        if (oldCommand.config.aliases) {
          let oldShortName = oldCommand.config.aliases;
          if (typeof oldShortName == "string") oldShortName = [oldShortName];
          for (let aliases of oldShortName) global.VexaBot.aliases.delete(aliases);
        }

        delete require.cache[require.resolve(pathCommand)];
        const command = require(join(__dirname, filename + ".js"));

        const configCommand = command.config;
        if (!configCommand) throw new Error("Config of command undefined");

        const nameScript = configCommand.name.toLowerCase();

        const indexWhenChat = allWhenChat.findIndex(item => item === oldNameCommand);

        if (indexWhenChat !== -1) {
          delete allWhenChat[indexWhenChat];
      
        }

        if (command.atChat) {
          if (!allWhenChat.includes(nameScript)) allWhenChat.push(nameScript);
        }
        
        if (command.atEvent) {
          global.VexaBot.atEvent.set(nameScript, command);
        }

        if (configCommand.aliases) {
          let { aliases } = configCommand;

          if (typeof aliases == "string") {
            aliases = [aliases];
          }

          for (const aliasesYuki of aliases) {
            if (typeof aliasesYuki === "string") {
              if (global.VexaBot.aliases.has(aliasesYuki)) {
                throw new Error(`Short Name ${aliasesYuki} already exists in other command: ${global.VexaBot.aliases.get(aliasesYuki)}`);
              } else {
                global.VexaBot.aliases.set(aliasesYuki, configCommand.name);
              }
            }
          }
        }

        if (!command.config.name) throw new Error(`Command without name !`);

        if (command.onLoad) {
          try {
            command.onLoad({ api: globalFCA });
          } catch (error) {
            const errorMessage = "Unable to load the onLoad function of the module."
            throw new Error(errorMessage + ' ' + error);
          }
        }

        global.VexaBot.commands.delete(oldNameCommand);
        global.VexaBot.commands.set(nameScript, command);

        return {
          status: "success",
          name: filename
        };
      } catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    }

     if (
       args[0] == "load"
       && args.length == 2
     ) {
       if (!args[1])
         return message.reply(getLang("missingFileName"));
       const infoLoad = loadScripts(args[1]);
       if (infoLoad.status == "success")
         message.reply(getLang("loaded", infoLoad.name));
       else {
         message.reply(
           getLang("loadedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message)
           + "\n" + infoLoad.error.stack
         );
         console.log(infoLoad.error);
       }
     }
     else if (
       (args[0] || "").toLowerCase() == "loadall"
       || (args[0] == "load" && args.length > 2)
     ) {
       const fileNeedToLoad = args[0].toLowerCase() == "loadall" ?
         fs.readdirSync(__dirname)
           .filter(file =>
             file.endsWith(".js") &&
             !file.match(/(eg)\.js$/g) &&
             (process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) 
           )
           .map(item => item = item.split(".")[0]) :
         args.slice(1);
       const arraySucces = [];
       const arrayFail = [];

       for (const fileName of fileNeedToLoad) {
         const infoLoad = loadScripts(fileName);
         if (infoLoad.status == "success")
           arraySucces.push(fileName);
         else
           arrayFail.push(` ❗ ${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
       }

       let msg = "";
       if (arraySucces.length > 0)
         msg += getLang("loadedSuccess", arraySucces.length);
       if (arrayFail.length > 0) {
         msg += (msg ? "\n" : "") + getLang("loadedFail", arrayFail.length, arrayFail.join("\n"));
         msg += "\n" + getLang("openConsoleToSeeError");
       }

       message.reply(msg);
     }
     else if (args[0] == "unload") {
       if (!args[1])
         return message.reply(getLang("missingCommandNameUnload"));
       const infoUnload = unloadScripts(args[1]);
       infoUnload.status == "success" ?
         message.reply(getLang("unloaded", infoUnload.name)) :
         message.reply(getLang("unloadedError", infoUnload.name, infoUnload.error.name, infoUnload.error.message));
     }
     else if (args[0] == "install") {
       let url = args[1];
       let fileName = args[2];
       let rawCode;

       if (!url || !fileName)
         return message.reply(getLang("missingUrlCodeOrFileName"));

       if (
         url.endsWith(".js")
         && !isURL(url)
       ) {
         const tmp = fileName;
         fileName = url;
         url = tmp;
       }

       if (url.match(/(https?:\/\/(?:www\.|(?!www)))/)) {
         
         if (!fileName || !fileName.endsWith(".js"))
           return message.reply(getLang("missingFileNameInstall"));

         const domain = getDomain(url);
         if (!domain)
           return message.reply(getLang("invalidUrl"));

         if (domain == "pastebin.com") {
           const regex = /https:\/\/pastebin\.com\/(?!raw\/)(.*)/;
           if (url.match(regex))
             url = url.replace(regex, "https://pastebin.com/raw/$1");
           if (url.endsWith("/"))
             url = url.slice(0, -1);
         }
         else if (domain == "github.com") {
           const regex = /https:\/\/github\.com\/(.*)\/blob\/(.*)/;
           if (url.match(regex))
             url = url.replace(regex, "https://raw.githubusercontent.com/$1/$2");
         }

         rawCode = (await axios.get(url)).data;

         if (domain == "savetext.net") {
           const $ = cheerio.load(rawCode);
           rawCode = $("#content").text();
         }
       }
       else {
         if (args[args.length - 1].endsWith(".js")) {
           fileName = args[args.length - 1];
           rawCode = event.body.slice(event.body.indexOf('install') + 7, event.body.indexOf(fileName) - 1);
         }
         else if (args[1].endsWith(".js")) {
           fileName = args[1];
           rawCode = event.body.slice(event.body.indexOf(fileName) + fileName.length + 1);
         }
         else
           return message.reply(getLang("missingFileNameInstall"));
       }

       if (!rawCode)
         return message.reply(getLang("invalidUrlOrCode"));

       if (fs.existsSync(path.join(__dirname, fileName)))
         return message.reply(getLang("alreadExist"), (err, info) => {
           global.VexaBot.atReact.set(info.messageID, {
             commandName,
             messageID: info.messageID,
             type: "install",
             author: event.senderID,
             data: {
               fileName,
               rawCode
             }
           });
         });
       else {
         const infoLoad = loadScripts(fileName, rawCode);
         infoLoad.status == "success" ?
           message.reply(getLang("installed", infoLoad.name, path.join(__dirname, fileName).replace(process.cwd(), ""))) :
           message.reply(getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message));
       }
     }
     else 
message.err();
  },
  atReact: async function ({ Reaction, message, event, getLang }) {

    const loadScripts = function (filename, raw) {

      try {
        const pathCommand = __dirname + `/${filename}.js`;
        if (raw) {
          try {
      const pathCommand = __dirname + `/${filename}`;
      fs.writeFileSync(pathCommand, raw); 
       return {
          status: "success",
          name: filename
        };
          } catch (err) {
       return {
          status: "failed",
          name: filename,
          error: err
        };
          }
        }

        if (!fs.existsSync(pathCommand)) throw new Error(`no file ${filename}.js founded`);
        const oldCommand = require(join(__dirname, filename + ".js"));
        const oldNameCommand = oldCommand.config.name;

        if (oldCommand.config.aliases) {
          let oldShortName = oldCommand.config.aliases;
          if (typeof oldShortName == "string") oldShortName = [oldShortName];
          for (let aliases of oldShortName) global.VexaBot.aliases.delete(aliases);
        }

        delete require.cache[require.resolve(pathCommand)];
        const command = require(join(__dirname, filename + ".js"));

        const configCommand = command.config;
        if (!configCommand) throw new Error("Config of command undefined");

        const nameScript = configCommand.name.toLowerCase();

        const indexWhenChat = allWhenChat.findIndex(item => item === oldNameCommand);

        if (indexWhenChat !== -1) {
          allWhenChat[indexWhenChat] = null;
        }

        if (command.atChat) {
          allWhenChat.push(nameScript);
        }

        if (command.atEvent) {
          global.VexaBot.atEvent.set(nameScript, command);
        }

        if (configCommand.aliases) {
          let { aliases } = configCommand;

          if (typeof aliases == "string") {
            aliases = [aliases];
          }

          for (const aliasesYuki of aliases) {
            if (typeof aliasesYuki === "string") {
              if (global.VexaBot.aliases.has(aliasesYuki)) {
                throw new Error(`Short Name ${aliasesYuki} already exists in other command: ${global.VexaBot.aliases.get(aliasesYuki)}`);
              } else {
                global.VexaBot.aliases.set(aliasesYuki, configCommand.name);
              }
            }
          }
        }

        if (!command.config.name) throw new Error(`Command without name !`);

        if (command.onLoad) {
          try {
            command.onLoad({api});
          } catch (error) {
            const errorMessage = "Unable to load the onLoad function of the module."
            throw new Error(errorMessage, 'error');
          }
        }

        global.VexaBot.commands.delete(oldNameCommand);
        global.VexaBot.commands.set(nameScript, command);

        return {
          status: "success",
          name: filename
        };
      } catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    }
    
		const { author, data: { fileName, rawCode } } = Reaction;
		if (event.userID != author)
			return;
		const infoLoad = loadScripts(fileName, rawCode);
		infoLoad.status == "success" ?
			message.reply(getLang("installed", infoLoad.name, path.join(__dirname, fileName).replace(process.cwd(), ""))) :
			message.reply(getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message));
  }
};