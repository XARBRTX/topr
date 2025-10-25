const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const jimp = require('jimp');

module.exports = {
  config: {
    name: "F",
    aliases: ["ف"],
    version: "1.0.0",
    author: "allou",
    countDown: 10,
    category: "تجربة",
    shortDescription: {
      en: "TEST",
      ar: "سوي محادثة حقيقية لشخص 🌚 رد عليه"
    },
    guide: {
      en: "",
      ar: "رد 🌚"
    },
    role: 2
  },
  atCall: async function({ args, message, usersData, event }) {
    const ID = event?.messageReply?.senderID || event.senderID;
    const pic = await usersData.getAvatarUrl(ID);
    const pic2 = await circle(pic, 60);
    const dpic = await loadImage(pic2);
    const text = args.join(" ");
    const { bubble, height } = createSpeechBubble(text);
    console.log(height);
    const canvas = createCanvas(600, bubble.height + 80);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bubble, 110, 40);
    ctx.drawImage(dpic, 30, bubble.height - 30);
   /* ctx.font = '24px Arial';
    ctx.fillStyle = '#646464'; 
    ctx.fillText("allou", 30*4, bubble.height - 30);*/
    const buffer = canvas.toBuffer('image/png');

    const imagePath = __dirname+'/cache/dynamic_speech_bubble.png';
    fs.writeFileSync(imagePath, buffer);
    message.reply({attachment: await fs.createReadStream(imagePath)});
  }
};

function createSpeechBubble(text, radius = 26, backgroundColor = '#E4E4E4', textColor = 'black') {
  const canvasInstance = createCanvas(1, 1); 
  const ctx = canvasInstance.getContext('2d');

  ctx.font = '24px Arial'; 
  const textWidth = ctx.measureText(text).width;

  const padding = 15;
  const lineHeight = 30;
  const maxWidth = 400;
  const wrappedText = wrapText(ctx, text, maxWidth - padding * 2); 
  const lines = wrappedText.split('\n');
  const width = Math.min(maxWidth, textWidth + padding * 2);
  const height = lines.length * lineHeight + padding * 2; 
  const bubbleCanvas = createCanvas(width, height);
  const bubbleCtx = bubbleCanvas.getContext('2d');

  bubbleCtx.fillStyle = backgroundColor;

  bubbleCtx.beginPath();
  bubbleCtx.moveTo(radius, 0);
  bubbleCtx.lineTo(width - radius, 0);
  bubbleCtx.quadraticCurveTo(width, 0, width, radius);
  bubbleCtx.lineTo(width, height - radius);
  bubbleCtx.quadraticCurveTo(width, height, width - radius, height);
  bubbleCtx.lineTo(radius, height);
  bubbleCtx.quadraticCurveTo(0, height, 0, height - radius);
  bubbleCtx.lineTo(0, radius);
  bubbleCtx.quadraticCurveTo(0, 0, radius, 0);
  bubbleCtx.closePath();

  bubbleCtx.fill();

  bubbleCtx.fillStyle = textColor;
  bubbleCtx.font = '24px Arial'; 
  bubbleCtx.textAlign = 'left';
  bubbleCtx.textBaseline = 'top';

  let y = padding;
  lines.forEach(line => {
    bubbleCtx.fillText(line, padding, y);
    y += lineHeight;
  });

  return {
    bubble: bubbleCanvas,
    height
  };
}

function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  let line = '';
  let wrappedText = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      wrappedText += line + '\n';
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }

  wrappedText += line;
  return wrappedText;
}

async function circle(imageData, size) {
  const img = await jimp.read(imageData);
  img.resize(size, size);
  img.circle();
  return img.getBufferAsync(jimp.MIME_PNG);
}