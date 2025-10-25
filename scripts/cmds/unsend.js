module.exports = {
	config: {
		name: "unsend",
    aliases: ["مسح"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			ar: "مسح رسالة البوت",
			en: "Unsend bot's message"
		},
		category: "box chat",
		guide: {
			ar: "رد ب{pn} على البوت",
			en: "reply the message you want to unsend and call the command {pn}"
		}
	},

	langs: {
		ar: {
			syntaxError: "رد على رسالتي 😡"
		},
		en: {
			syntaxError: "Please reply the message you want to unsend"
		}
	},

	atCall: async function ({ message, event, api, getLang }) {
		if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
			return message.reply(getLang("syntaxError"));
		message.unsend(event.messageReply.messageID);
	}
}