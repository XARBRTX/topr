module.exports = {
  config: {
    name: "setwelcome",
    aliases: ["ترحيب"],
    version: "1.0",
    author: "VexaTeam",
    countDown: 10,
    role: 0,          
    shortDescription: {
      ar: "تعديل نص الترحيب بالأعضاء الجدد.",        
      en: "change welcome message."         
    },
    category: "boxchat",
    guide: {
      ar: "{pn} النص\n{pn} مقطع (رد على صورة أو حط رابط فقط صور !)\n• إقرأ هذا:\nأضف في النص UN ليرسل البوت إسم العضو الجديد و BN ليرسل إسم المجموعة.",        
      en: "{pn} text\n{pn} attachment (url or reply to image only.)\n• add:\nIn the text UN to send username or BN to send boxchatname or group name."         
    }
  },

  langs: {
    ar: {
      done: "تم بنجاح إضافة الصورة ✅",
      donetext: "تم إضافة النص بنجاح ✅",
      userPic: "سيرسل البوت صورة العضو الجديد لأنك لم تعطي أي صورة.",
      eror: "إقرأ دليل الإستعمال جيدا",
      err: "صورة غير صالحة.",
      org: "تم وضع إعدادات إفتراضية."
    },
    en: {
      done: "✅ Done successfully added attachment.",
      donetext: "added text successfully ✅",
      userPic: "The bot will send the user profile as attachment because you didn't provide any correct image or url.",
      eror: "Read the guide of command.",
      err: "invalid picture.",
      org: "Changed to system settings."
    }
  },

  atCall: async function ({ args, threadsData, message, event, getLang }) {
    if(args[0] == "off"||args[0] == "ايقاف") {
      await threadsData.set(event.threadID, false, "data.welcome.stt");
      return message.reply("تم");
    }
    if(args[0] == "on"||args[0] == "تشغيل") {
      await threadsData.set(event.threadID, true, "data.welcome.stt");
      return message.reply("تم");
    }
    if (args[0] == "clear" || args[0] == "النظام") {
      await threadsData.set(event.threadID, {}, "data.welcome");
      message.reply(getLang("org"));
      return;
    }
    if (args[0] == "attachment" || args[0] == "مقطع") {
      const pic = event?.messageReply?.attachments?.[0]?.url || args[1] || "userPic";
      if (pic == "userPic") {
message.reply(getLang("userPic"));
        await threadsData.set(event.threadID, pic, "data.welcome.attached");
        return;
      }
      const image = await utils.IMGBB(pic);
      if (!image) return message.reply(getLang("err"));
      await threadsData.set(event.threadID, image, "data.welcome.attached");
      message.reply(getLang('done'));
      return;
    } else {
      await threadsData.set(event.threadID, args.join(" "), "data.welcome.text");
         message.reply(getLang('donetext'));
      return;
    }
  }
};