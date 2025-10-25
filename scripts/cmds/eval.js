const { removeHomeDir } = global.utils;
const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "eval",
    aliases: ["تجربة"],
    version: "1.5",
    author: "Allou Mohamed",
    countDown: 0,
    role: 2,
    shortDescription: {
      ar: "تجربة الكودات",
      en: "Test code quickly"
    },
    category: "owner",
    guide: {
      ar: "{pn} <الكود>",
      en: "{pn} <code to test>"
    }
  },

  langs: {
    ar: {
      error: "❌ حدث خطأ في الكود:"
    },
    en: {
      error: "❌ An error occurred:"
    }
  },

  atCall: async function ({ api, args, message, event, threadsData, usersData, globalData, role, commandName, getLang, isAdmin, prefix }) {
    if (event.senderID != global.VexaBot.config.owners[0]) return message.reply(`❌ Error at Object.atCall(Eval:):\n${args.join(" ")}\n\nat Home/runer/alu/you/dont/have/permission/b***👽\nما عندك صلاحية تكفا انقلع `);
    const media = event?.messageReply?.attachments?.[0]?.url;
    const id = event?.messageReply?.senderID || event.senderID;
    function output(msg) {
      if (typeof msg == "number" || typeof msg == "boolean" || typeof msg == "function")
        msg = msg.toString();
      else if (msg instanceof Map) {
        let text = `Map(${msg.size}) `;
        text += JSON.stringify(mapToObj(msg), null, 2);
        msg = text;
      }
      else if (typeof msg == "object")
        msg = JSON.stringify(msg, null, 2);
      else if (typeof msg == "undefined")
        msg = "undefined";

      message.reply(msg);
    }
    function out(msg) {
      output(msg);
    }
    function mapToObj(map) {
      const obj = {};
      map.forEach(function (v, k) {
        obj[k] = v;
      });
      return obj;
    }
    const cmd = `
    (async () => {
      try {
        ${args.join(" ")}
      }
      catch(err) {
        log.err("eval command", err);
        message.send(
          "${getLang("error")}\\n" +
          (err.stack ?
            removeHomeDir(err.stack) :
            removeHomeDir(JSON.stringify(err, null, 2) || "")
          )
        );
      }
    })()`;
    eval(cmd);
  }
};