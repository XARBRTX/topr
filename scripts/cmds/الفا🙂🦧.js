const axios = require('axios');

module.exports = {
  config: {
    name: "مارلين",
    version: "1.0",
    author: "Yuki",
    countDown: 5,
    role: 0,
    shortDescription: "محادثة مع مارلين (Chipp.ai)",
    category: "الذكاء الاصطناعي",
    guide: "{pn} [سؤالك]"
  },

  atCall: async function ({ message, args, event }) {
    const userInput = args.join(" ");
    if (!userInput) return message.reply("⌯︙اكتب سؤالك ياكيوت.");

    return handleMarlin({ message, event, userInput });
  },

  onReply: async function ({ message, event, Reply }) {
    const userInput = event.body;
    return handleMarlin({ message, event, userInput });
  }
};

async function handleMarlin({ message, event, userInput }) {
  const politeWords = ["رجاء", "ممكن", "لو سمحت", "من فضلك", "احبك", "عزيزي"];
  const rudeWords = ["غباء", "تافه", "اخرس", "اسكت", "حقير", "عبيط"];

  const inputLower = userInput.toLowerCase();
  const isPolite = politeWords.some(word => inputLower.includes(word));
  const isRude = rudeWords.some(word => inputLower.includes(word));

  let lorePrefix = ``;
  if (isPolite) {
    lorePrefix += ` كن لبقًا ولطيفًا في ردك لأن السائل محترم.`;
  } else if (isRude) {
    lorePrefix += ` استخدم سخرية مهذبة في ردك لأن السائل وقح.`;
  } else {
    lorePrefix += ` كن طبيعيًا في ردك.`;
  }

  const fullPrompt = `${lorePrefix}\n\nالسؤال: ${userInput}`;

  try {
    const reply = await sendToMarlin(fullPrompt);
    message.reply(`⌯︙${reply}`, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "مارلين"
      });
    });
  } catch (err) {
    console.error(err);
    message.reply("⌯︙حدث خطأ أثناء الاتصال بـ مارلين.");
  }
}

async function sendToMarlin(content) {
  function extractMessage(raw) {
    const lines = raw.split('\n');
    const message = lines
      .filter(line => line.trim().startsWith('0:'))
      .map(line => {
        const match = line.match(/0:"(.*)"/);
        return match ? match[1] : '';
      })
      .join('')
      .replace(/\\n/g, '\n')
      .trim();

    if (message) return message;

    const toolLine = lines.find(line => line.trim().startsWith('a:'));
    if (toolLine) {
      try {
        const json = JSON.parse(toolLine.slice(2));
        const results = json.result?.organic;
        if (Array.isArray(results)) {
          return results.map(r => `- ${r.title}\n  ${r.snippet}\n  ${r.link}`).join('\n\n');
        }
      } catch {
        return '⚠️ خطأ في قراءة الرد.';
      }
    }

    return '⚠️ لا يوجد رد.';
  }

  const response = await axios.post(
    'https://newapplication-10028581.chipp.ai/api/chat',
    {
      messages: [{ role: 'user', content }],
      chatSessionId: 'abd6300b-d95c-4286-89e4-beb7d9c72824'
    },
    {
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 GoatBot Integration',
        'Referer': 'https://newapplication-10028581.chipp.ai/w/chat/'
      }
    }
  );

  return extractMessage(response.data);
}
