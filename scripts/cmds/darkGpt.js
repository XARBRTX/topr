const axios = require('axios');

// config 
const maxStorageMessage = 4;

if (!global.temp.openAIUsing)
	global.temp.openAIUsing = {};
if (!global.temp.openAIHistory)
	global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

module.exports = {
	config: {
		name: "gpt",
        aliases: ["فيكسا", "شات"],
		version: "1.4",
		author: "محمد ألو",
		countDown: 5,
		role: 0,
        shortDescription: {
			ar: "شات جي بي تي",
			en: "GPT chat"
		},
		category: "المجموعة",
		guide: {
            ar: "{pn} طلب\n{pn} مسح",
			en: "   {pn} <clear> - clear chat history with gpt"
				+ "\n   {pn} <content> - chat with gpt"
		}
	},

	langs: {
        ar: {
			invalidContent: "نعم بدك شي ؟",
			error: "إيرور:\n%1",
			clearHistory: "تم مسح المحادثة"
		},
		en: {
			invalidContent: "Please enter the content you want to chat",
			error: "An error has occurred\n%1",
			clearHistory: "Your chat history with gpt has been deleted"
		}
	},

	atCall: async function ({ message, event, args, getLang, prefix, commandName }) {
		switch (args[0]) {
            case 'مسح':
			case 'clear': {
				openAIHistory[event.senderID] = [];
				return message.reply(getLang('clearHistory'));
			}
			default: {
				if (!args[0])
					return message.reply(getLang('invalidContent'));

				handleGpt(event, message, args, getLang, commandName);
			}
		}
	},

	atReply: async function ({ Reply, message, event, args, getLang }) {
        const { author, commandName } = Reply;
		if (author != event.senderID)
			return;

		handleGpt(event, message, args, getLang, commandName);
	}
};

async function askGpt(event) {
	const response = await axios({
		url: "https://chatbot-ji1z.onrender.com/chatbot-ji1z",
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			messages: openAIHistory[event.senderID]
		}
	});
	return response;
}

async function handleGpt(event, message, args, getLang, commandName) {
	try {
		openAIUsing[event.senderID] = true;

		if (
			!openAIHistory[event.senderID] ||
			!Array.isArray(openAIHistory[event.senderID])
		)
			openAIHistory[event.senderID] = [];

		if (openAIHistory[event.senderID].length >= maxStorageMessage)
			openAIHistory[event.senderID].shift();

		openAIHistory[event.senderID].push({
			role: 'user',
			content: args.join(' ')
		});

		const response = await askGpt(event);
		const text = response.data.choices[0].message.content;

		openAIHistory[event.senderID].push({
			role: 'assistant',
			content: text
		});

		return message.reply(text, (err, info) => {
			global.VexaBot.atReply.set(info.messageID, {
				commandName,
				author: event.senderID,
				messageID: info.messageID
			});
		});
	}
	catch (err) {
		const errorMessage = err.response?.data.error.message || err.message || "";
		return message.reply(getLang('error', errorMessage));
	}
	finally {
		delete openAIUsing[event.senderID];
	}
}