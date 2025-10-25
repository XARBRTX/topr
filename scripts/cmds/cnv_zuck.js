const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: 'zuck',
    aliases: ["مارك"],
    author: 'allou Mohamed',
    famo: "mark",
    version: '1.0.0',
    role: 0,
    category: 'memes',
    guide: '{pn}',
    shortDescription: {
      en: 'mark publications.',
      ar: 'منشور مارك هه.'
    }
  },
  atCall: async function({ message, args }) {
    const background = await loadImage('https://i.ibb.co/LzJFQqS/Kx0MC9t.jpg');

    const canvasWidth = background.width;
    const canvasHeight = background.height;

    // Create canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    const text = args.join(" ");
    const fontSize = 40;
    const fontFamily = 'Arial';
    const textColor = 'black';
    const textX = 50;
    let textY = canvasHeight / 4 + 30;
    const maxLineWidth = canvasWidth - textX * 2;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';

    const lines = wrapText(text, ctx, maxLineWidth);
    for (const line of lines) {
        ctx.fillText(line, textX, textY);
        textY += fontSize + 15; 
    }

    const out = fs.createWriteStream(__dirname + '/cache/zuck_image.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
        message.reply({
            body: `خبرت ${this.config.famo} ينشر و نشر 🐢`,
            attachment: fs.createReadStream(__dirname + '/cache/zuck_image.png')
        });
    });
  }
};

function wrapText(text, context, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let line = '';

    for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }

    lines.push(line);
    return lines;
}
