const numberslst = {};

module.exports = {
  config: {
    name: 'nums',
    aliases: ["أرقام"],
    author: 'allou mohamed',
    version: '1.0.0',
    role: 0,
    category: 'الألعاب',
    guide: '{pn}',
    description: 'لعبة أرقام مثل إكسون 🌞'
  },
  atCall: async function ({ message, event }) {
    if (!numberslst[event.threadID]) numberslst[event.threadID] = {};
    const s = event.senderID;
    numberslst[event.threadID].s = {
      a: true,
      b: utils.randomNumber(1, 100),
      d: 0
    };

    message.reply('حسنا إحزر رقما بين 1 و 100.');
  },
  atChat: async function ({ message, event, usersData }) {
    const s = event.senderID;
if (!numberslst[event.threadID]) return;
    if (!numberslst[event.threadID].s) return;

    let { a, b, d } = numberslst[event.threadID].s;

    const c = parseInt(event.body);

    if (a && c > b) {
      numberslst[event.threadID].s.d = d + 1;
      message.react('⬇️');
      return;
    }
    if (a && c < b) {
      numberslst[event.threadID].s.d = d + 1;
      message.react('⬆️');
      return;
    }

    const name = await usersData.getName(event.senderID);

    if (a && c == b) {
      let r;
      let m;
      if (d < 10) { r = 400; m = "عدد محاولاتك قليل جدا و جيد." }
      if (d > 10) { r = 200; m = "محاولاتك كانت كثيرة يا نوب." }
      message.react('🥳');
      message.reply(`كفوا ${name} الرقم هو ${b} فعلا.\n-ربحت ${r} لأن ${m}.\n- ${d} محاولات.`);
        await usersData.addMoney(s, r);
      numberslst[event.threadID].s = {};
    }
  }
};