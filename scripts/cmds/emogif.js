const axios = require("axios");
const cheerio = require('cheerio');

module.exports = {
  config: {
    name: "emojigif",
    aliases: ["جيف", "emojif", "emogif", "emojijif"],
    version: "1.3",
    author: "allou mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "معنى إيموجي",
      en: "Find the gif of emoji"
    },
    category: "wiki",
    guide: {
      ar: "   {pn} <إيموجي>: يريك معناه.",
      en: "   {pn} <emoji>: Find the gif of emoji"
    }
  },

  langs: {
    ar: {
      missingEmoji: "⚠️ أدخل الإيموجي.",
      manyRequest: "⚠️ لسيرفر معطل",
      notHave: "ما عنده صورة."
    },
    en: {
      missingEmoji: "⚠️ You have not entered an emoji",
      manyRequest: "⚠️ The bot has sent too many requests, please try again later",
      notHave: "Not have"
    }
  },

  atCall: async function ({ args, message, event, getLang }) {
    const emoji = args[0];
    if (!emoji)
      return message.reply(getLang("missingEmoji"));

    let getMeaning;
    try {
      getMeaning = await getEmoji(emoji);
    }
    catch (e) {
      if (e.response && e.response.status == 429) {
        let tryNumber = 0;
        while (tryNumber < 3) {
          try {
            getMeaning = await getEmoji(emoji);
            break;
          }
          catch (e) {
            tryNumber++;
          }
        }
        if (tryNumber == 3)
          return message.reply(getLang("manyRequest"));
      }
    }
    
    let images = getMeaning.images;

    let image = images.find(i => i.platform == "Telegram");
    
    message.stream("الجيف: ", "https://www.emojiall.com/"+ image.url);
  }
};

async function getEmoji(emoji) {
  const urlImages = `https://www.emojiall.com/en/image/${encodeURI(emoji)}`;
  const { data: dataImages } = await axios.get(urlImages);

  const $images = cheerio.load(dataImages);
  const getEl5 = $images(".emoji_card_content").find('img[loading="lazy"]');
  const arr = [];

  getEl5.each((i, el) => {
    const content = $images(el).parent().find("p[class='capitalize'] > a[class='text_blue']").eq(1).text().trim();
    const href = $images(el).attr("data-src") || $images(el).attr("src");
    arr.push({
      url: href,
      platform: content
    });
  });

  return {
    images: arr,
    source: urlImages
  };
}

