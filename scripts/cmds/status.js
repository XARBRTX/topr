const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');


registerFont(__dirname+'/canvas/fonts/glitch.otf', { family: 'glitch' });

const background = __dirname+'/canvas/status/status.jpg';

module.exports = {
    config: {
        name: 'status',
        aliases: ["حالة", "outline"],
        author: 'Your Name',
        version: '1.0.0',
        role: 0,
        category: 'تصميم',
        guide: '{pn}',
        shortDescription: {
            en: 'Create status canvas with outline and user picture.',
            ar: 'إنشاء لوحة حالة مع إطار وصورة المستخدم.'
        }
    },
    atCall: async function({ args, threadsData, message, event, usersData }) {
      ///🌝 let fuk it
      const uid = event?.messageReply?.senderID || Object.keys(event?. mentions)[0] || event.senderID;
      
      const tiddata = await threadsData.get(event.threadID);
      const members = tiddata.members;
      const fin = members.find(user => user.userID == uid);
      const count = fin?.count || 0;
      const points = await usersData.getPoints(uid);
      const money = await usersData.getMoney(uid);
      const name = await usersData.getName(uid);
      const bank = 0;//soon
      
      
      const reactions = await usersData.get(uid, "data.reactions") || 0;
      
 

      let freeFireRank;
      if (points >= 250) {
          freeFireRank = "18 | جراند ماستر 🌟👑";
      } else if (points >= 210) {
          freeFireRank = "17 | ماستر 👑";
      } else if (points >= 190) {
          freeFireRank = "16 | هيرويك 🌟";
      } else if (points >= 170) {
          freeFireRank = "15 | الماس III 💎";
      } else if (points >= 160) {
          freeFireRank = "14 | الماس II 💎";
      } else if (points >= 150) {
          freeFireRank = "13 | الماس 💎";
      } else if (points >= 140) {
          freeFireRank = "12 | بلاتينيوم III 🏆";
      } else if (points >= 130) {
          freeFireRank = "11 | بلاتينيوم II 🏆";
      } else if (points >= 120) {
          freeFireRank = "10 | بلاتينيوم 🏆";
      } else if (points >= 100) {
          freeFireRank = "9 | ذهب III 🥇";
      } else if (points >= 90) {
          freeFireRank = "8 | ذهب II 🥇";
      } else if (points >= 80) {
          freeFireRank = "7 | ذهب 🥇";
      } else if (points >= 70) {
          freeFireRank = "6 | فضي III 🥈";
      } else if (points >= 60) {
          freeFireRank = "5 | فضي II 🥈";
      } else if (points >= 40) {
          freeFireRank = "4 | فضي 🥈";
      } else if (points >= 20) {
          freeFireRank = "3 | برونز III 🥉";
      } else if (points >= 10) {
          freeFireRank = "2 | برونز II 🥉";
      } else if (points >= 5) {
          freeFireRank = "1 | برونز 🥉";
      } else {
          freeFireRank = "0 | مبتدأ 🐢";
      }

      ///🌝 done fuked
      
      const pic = await usersData.getAvatarUrl(uid);
      const profile = await loadImage(pic);
      
      
      const canvas = createCanvas(1272, 500);
      const ctx = canvas.getContext('2d');
      const bg = await loadImage(background);
      
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(profile, 48, 50, 180, 180);

     

      ctx.font = "50px glitch";
      ctx.fillStyle = 'black';

      ctx.fillText(name, 48, 40 + 200 + 50);//name
      
      ctx.font = "bold 30px Arial";
      //
      ctx.fillStyle = '#BFBFBF';
      ctx.fillText("UID: "+uid, 850, 30);//uid

     
      
      ctx.fillStyle = '#0053FF';
      ctx.font = "bold 50px Arial";
      ctx.globalAlpha = 0.6;
       ctx.fillText("0", 180, 425);
      ctx.fillText("0", 530, 425);
      ctx.fillText("0", 880, 425);
      ctx.fillText("0", 880, 160);
      
      ctx.globalAlpha = 1;
      const exp = 900;
      const level = Math.floor(exp / 50);
      const nextL = expToNextLevel(exp)
      const barWidth = (exp / (exp + nextL)) * 200;
      ctx.fillStyle = '#FF0010';
      ctx.fillRect(350, 200, 200, 30);
      ctx.fillStyle = '#2100FF';
      ctx.fillRect(350, 200, barWidth, 30);
      ctx.fillStyle = '#000';
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = '#BFBFBF';
      ctx.fillText('Level ' + level, 350/*🌝*/, 190/*👑*/); 
      ctx.fillText(`${exp}/${exp + nextL}`, 350/*🌝*/, 225/*👑*/); 
      
      
      const out = fs.createWriteStream(__dirname + '/cache/statusCanvas.png');
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on('finish', () => {
          message.reply({
              attachment: fs.createReadStream(__dirname + '/cache/statusCanvas.png')
          });
      });

    }
};

function expToNextLevel(currentExp) {
    const expPerLevel = 50; // Potato done here
    const currentLevel = Math.floor(currentExp / expPerLevel);
    const expToCurrentLevel = currentLevel * expPerLevel;
    const expToNextLevel = (currentLevel + 1) * expPerLevel;
    return expToNextLevel - currentExp;
}