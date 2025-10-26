const sleep = require("time-sleep");
const logg = require('./logger/log.js');
const Arabic = require('./logger/Arabic.js');
console.log(Arabic("أنا فيكسا بوت"));
Arr = Arabic;
log = logg;
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const moment = require("moment-timezone");
const { NODE_ENV } = process.env;
const dirConfig = require('./config.js');
const config = require(dirConfig);
const login = require('./vexa-chat-api');

global.VexaBot = {
  cooldowns: {},
  commands: new Map(),
  events: new Map(),
  aliases: new Map(),
  countDown: new Map(),
  atChat: [],
  atReact: new Map(),
  atReply: new Map(),
  atEvent: new Map(),
  onListen: new Map(),
  Event: [],
  mainPath: process.cwd(),
  config: config,
  dirConfig: dirConfig,
  antiSpamMessage: {
    wait: [],
    threadbanned: [],
    userbanned: []
  },
  UID: null,
  log: logg,
  cmdsPath: path.join(__dirname, "scripts", "cmds"),
  eventsPath: path.join(__dirname, "scripts", "events"),
  cachePath: path.join(__dirname, "scripts", "cmds", "cache"),
  api: null,
  start: Date.now() - process.uptime() * 1000
};

global.db = {
  allThreadData: [],
  allUserData: [],
  allGlobalData: [],
  threadModel: null,
  userModel: null,
  globalModel: null,
  threadsData: null,
  usersData: null,
  globalData: null,
  receivedTheFirstMessage: {}
};

global.DB = {
  database: {
    creatingThreadData: [],
    creatingUserData: [],
    creatingDashBoardData: [],
    creatingGlobalData: []
  }
};

global.temp = {
  createThreadData: [],
  createUserData: [],
  createThreadDataError: [],
  filesOfGoogleDrive: {
    arraybuffer: {},
    stream: {},
    fileNames: {}
  }
};

global.client = {
    
};

const utils = require('./utils.js');
const helpers = require("./vexa/helpers.js");
global.helpers = helpers;
global.utils = utils;
Vexa = utils;
Li = helpers.Li;
require('./languages/getText.js');
   try { 
    VexaBot.dirconfig = path.join(global.VexaBot.mainPath, "config.json");
      } catch(error) {
     log.err('cant Load config');
     process.exit();
      }

 console.log(Li("Facebook"));
 log.info('FACEBOOK', 'Starting login in');

try {
  let fileName = "account.txt"; 
  if (config.cookies) {
    fileName = config.cookies;
  }
  const appStateFile = path.resolve(fileName);
  if (fs.existsSync(appStateFile)) {
    var appState = JSON.parse(fs.readFileSync(appStateFile, 'utf8'));
    log.info("FACEBOOK", "Found the Bot cookies");
  } else {
    log.info("FACEBOOK", "Can't find the bot's Facebook cookies");
  }
} catch (e) {
  log.err("FACEBOOK", "Error reading Facebook cookiees Check the file and put correct FB cokies");
  return;
}

  async function StartYuki() {   
   const loginOp = {};
    loginOp.appState = appState;
    login(loginOp, async (Errors, FCA) => {      
     if (Errors) { 
       console.log(JSON.stringify(Errors,null, 2)); 
  return;                             
     }        
  globalFCA = FCA;      
const DB = require('./vexa/core/databaseLoader.js');                      
const { threadModel, userModel, globalModel, threadsData, usersData, globalData } = await DB();
 FCA.setOptions(config.FBOPTIONS);  
  global.VexaBot.api = FCA;  
    await require('./vexa/core/scriptsLoader.js')(global.VexaBot, FCA);
  global.VexaBot.UID = FCA.getCurrentUserID();

  if (config.autoCleanCache) {
fs.readdir(global.VexaBot.cachePath, (err, files) => {
    if (err) {
      log.info("Error reading folder of cache");
    } else {
      if (files.length === 0) {
      } else {
        files.forEach(file => {
          const filePath = path.join(global.VexaBot.cachePath, file);
          fs.unlink(filePath, (err) => {
            if (err) {
            } else {     
            }  
          });
        });
      }
    }
  });
}

const listener = require('./vexa/core/handlerActions.js')({ api: FCA, threadModel: threadModel, userModel: userModel, globalModel: globalModel, threadsData: threadsData, usersData: usersData, globalData: globalData });                                         
const dashboard  = require('./vexa/app.js')({ api: FCA, threadModel: threadModel, userModel: userModel, globalModel: globalModel, threadsData: threadsData, usersData: usersData, globalData: globalData });

const startListening = async () => {
  log.warn('Ready to listen');
  try {
      setInterval(checkMQTTStatus, 10 * 60 * 1000);
    await FCA.listenMqtt(async (error, event) => {
      console.log(event)
      if (error) {
        if (error.type === 'account_inactive') {
          log.err('FACEBOOK', error.error);
          return;
        }
        await startListening();
      }
      await listener(event);
    });
  } catch (listenError) {
    log.err('Error starting listening', listenError);
  }
};

 const refreshListening = async () => {
  try {
    await FCA.stopListening();
    await sleep(2000);
    await startListening();
    log.info('MQTT', 'Listening refreshed');
    return {
      success: true
    };
  } catch (error) {
    if (error.message === 'Expected error message for stopping listening') {
      log.err('Error stopping listening', error);
    } else {
      log.info('Error restarting listening', error);
    }
    return {
      success: false,
      error: error.message
    };
  }
};

Vexa.rl = refreshListening;

await startListening()
  .then(e => {
    log.info('BOT Start Listening...');
    console.log(`\x1b[93m────────────────────────────────\x1b[0m`);
  async function ad() { 
    const admins = config.owners;
  for (let i = 0; i < admins.length; i++) {
    const name = await usersData.getName(admins[i]);
    const uid = admins[i];
    log.success("ADMINBOT", `[${i +1}] ${uid} | ${name}`);
   }
  }

    async function inf() {
      const { nickNameBot, prefix, version, author } = config;
      console.log(`\x1b[93m────────────────────────────────\x1b[0m`);
      log.info('BOT ID', global.VexaBot.UID);
      log.info('NICK NAME', nickNameBot),
      log.info('PREFIX', prefix);
      log.info('AUTHOR', author);
      log.info('VERSION', version);
      console.log(`\x1b[93m────────────────────────────────\x1b[0m`);
    }  

   ad()
  .then(e => inf())
  })
  .catch(e => {
    return console.error(e);
  });
    });
  }
  function defStmp(A, B) {
    const timeDifference = A - B;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference;
}

async function checkMQTTStatus() {
  
    if (global.VexaBot.evStor) {
        const def = defStmp(Date.now(), parseInt(global.VexaBot.evStor));
        //console.log(def);
        if (!isNaN(def) && def > 0.2) {
            log.info("MQTT", "Bot stopped listening to chats.");
            const res = Vexa.rl();
            if (res.success) {
            log.info("MQTT", "Refreshed listening successfully.");
                } else {
            log.err("MQTT", "Can't refresh listening.");
                }
        } else {
            log.info("MQTT", "Bot is fine!");
        }
    } else {
        log.info("MQTT", "No last event found.");
    }
}

(async () => {
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));
StartYuki();
})();
