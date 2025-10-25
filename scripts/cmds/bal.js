const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = {
  config: {
    name: "bal",
    aliases: ["رصيد"],
    version: "1.0",
    author: "VexaTeam",
    countDown: 10,
    role: 0,
    shortDescription: {
      ar: "رؤية رصيدك",
      en: "see your balance"
    },
    category: "bot",
    guide: {
      ar: "{pn}",
      en: "{pn}"
    }
  },
  
  langs: {
    ar: {
      bal: "لديك %1 عملة."
    },
    en: {
      bal: "You have %1 $"
    }
  },
  
  atCall: async function ({ args, message, event, usersData, getLang }) {
    if (args[0] == "تحويل") {
      const target = event?.messageReply?.senderID;
      const U_M = await usersData.getMoney(event.senderID);
      if (!target) return message.reply("رد على شخص 🌝");
      const amount = parseInt(args[1]);
      if (amount > U_M) return message.reply("ما معك هذا الرصيد 😔💔🙍‍♀️");
      if (!amount || amount < 50 || isNaN(amount)) return message.reply("بخيل  ما تقدر تحول إلى مبلغ أكثر من 50 💔🌝");
      await transfer(event.senderID, target, amount, usersData, message, event);
      return;
    }
    if (args[0] == "top" || args[0] == "توب") {
      const filePath = await generateTopUsersImage(usersData);
      const readStream = fs.createReadStream(filePath);
      readStream.on('open', function () {
        message.reply({ attachment: readStream });
      });
      readStream.on('error', function (err) {
        console.error('Error sending image:', err);
      });
      return;
    } else { 
      message.reply(getLang("bal", await usersData.get(event.senderID, "money")));
    }
  }
};

async function generateTopUsersImage(usersData) {
  const canvasWidth = 480;
  const canvasHeight = 1067;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  
const rand = ["FFAC00", "00FF96", "00DDFF"];
const rand_ = Math.floor(Math.random() * rand.length);
  const S = rand[rand_];
  ctx.fillStyle = '#'+S;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.font = '40px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('THE TOP USERS', canvasWidth / 2, 40);

  const topUsers = await getTopUsers(usersData);

  for (let i = 0; i < topUsers.length; i++) {
    const user = topUsers[i];
    const avatarUrl = await usersData.getAvatarUrl(user.userID);
    const image = await loadImage(avatarUrl);

    const avatarSize = 100;
    const x = 50; 
    const y = 100 + i * (avatarSize + 20); 

    ctx.drawImage(image, x, y, avatarSize, avatarSize);
    
    
    const textX = x + avatarSize + 100; 
    const textY = y + avatarSize / 2; 

    ctx.font = '20px Arial';
    ctx.fillStyle = '#000000';

    ctx.fillText(user.name, textX, textY - 10);
    ctx.fillText(`Balance: ${user.money}`, textX, textY + 10);
    ctx.fillText(`Exp: ${user.exp}`, textX, textY + 30); 
  }

  const filePath = path.join(__dirname, 'cache', 'bal.png');
  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on('finish', () => resolve(filePath));
    out.on('error', reject);
  });
}

async function getTopUsers(usersData) {
  let users = await usersData.getAll();
  users = users.filter(user => user.money > 0);
  users.sort((a, b) => b.money - a.money);
  return users.slice(0, 8);
}


async function transfer(senderID, target, amount, usersData, message, event) {
  try {
    await usersData.addMoney(target, amount);
    await usersData.subtractMoney(senderID, amount);
    message.reply("تم تحويل بنجاح 🌝✅ النقود 🙍‍♀️");
  } catch(error) {
    message.reply(error.message);
  }
}