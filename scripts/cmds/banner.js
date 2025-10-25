const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

registerFont(__dirname + '/canvas/fonts/red.ttf', { family: 'red' });
module.exports = {
  config: {
    name: "dream",
    aliases: ["دريم"],
    version: "1.0.0",
    author: "allou",
    countDown: 10,
    category: "test",
    shortDescription: {
      en: "Generate a banner",
      ar: "صنع بانرز"
    },
    guide: {
      en: "{pn} text",
      ar: "{pn} اسمك مثلا"
    },
    role: 2
  },
  atCall: async function({ args, message, usersData, event }) {
    const background = await loadImage(__dirname + '/canvas/status/red-banner.jpg');
    const width = background.width;
    const height = background.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '100px red';

    ctx.fillStyle = '#FF3C00';
    const name = await usersData.getName(event.senderID);
    const text = args.join(' ') || name.split(" ")[0] || "YourText";
    const textWidth = ctx.measureText(text).width;

    const textX = (width - textWidth) / 2;
    const textY = height / 2 + 40;

    ctx.fillText(text, textX, textY);

    const imagePath = __dirname + '/cache/red-banner.png'; 
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();

    stream.pipe(out);
    out.on('finish', () => {
      message.reply({ attachment: fs.createReadStream(imagePath) }, () => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  }
};
