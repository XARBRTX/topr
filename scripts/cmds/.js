module.exports = {
  config: {
    name: "choose",
    aliases: ["إختار", "اختار"],
    version: "1.0.0",
    category: "بطاطس",
    author: "علو محمد",
    countDown: 10,
    shortDescription: {
      en: "choose (:",
      ar: "يختار"
    },
    guide: {
      en: "{pn} prm, prm, prm",
      ar: "{pn} prm او prm"
    },
    role: 0
  },
  atCall: async function({ args, message }) {
    const userParam = args.join(" ");
    let arr;

if (userParam.includes("أو")) {
  arr = userParam.split("أو").map(i => i.trim());
} else if (userParam.includes("او")) {
  arr = userParam.split("او").map(i => i.trim());
} else {
  // Handle the case where neither "أو" nor "او" is present in userParam
}

    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomFromArr = arr[randomIndex];
    message.reply(`أنا أختار ${randomFromArr} 🌝✅`);
  }
};
