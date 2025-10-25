const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

module.exports = {
  config: {
    name: "home",
    version: "1.0",
    author: "Faith XE | Samir Œ",
    shortDescription: "Generate home canvas",
    longDescription: "Generate a canvas with avatar images of participants.",
    category: "Image Processing"
  },

  atCall: async function ({ api, usersData,  event }) {
    const a = event.participantIDs;
    const avatarUrls = [];

    async function fetchAvatarUrls() {
      for (const id of a) {
        const avatarUrl = await usersData.getAvatarUrl(id);
        avatarUrls.push(avatarUrl);
      }
    }

    await fetchAvatarUrls();

    function calculateDimensions(numImages) {
      const maxColumns = 20; 
      const minImageSize = 100; 
      const spacing = 10; 

      const columns = Math.min(maxColumns, Math.ceil(Math.sqrt(numImages)));
      const rows = Math.ceil(numImages / columns);

      const imageSize = Math.max(minImageSize, Math.floor((2400 - spacing * (columns + 1)) / columns));
      const canvasWidth = imageSize * columns + spacing * (columns + 1);
      const canvasHeight = imageSize * rows + spacing * (rows + 1);

      return { canvasWidth, canvasHeight, imageSize, columns, rows, spacing };
    }

    async function drawImages() {
      const { canvasWidth, canvasHeight, imageSize, columns, rows, spacing } = calculateDimensions(avatarUrls.length);
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      let x = spacing;
      let y = spacing;

      for (let i = 0; i < avatarUrls.length; i++) {
        const url = avatarUrls[i];
        const img = await loadImage(url);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + imageSize / 2, y + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, imageSize, imageSize);
        ctx.restore();

        x += imageSize + spacing;

        if ((i + 1) % columns === 0) {
          x = spacing;
          y += imageSize + spacing;
        }
      }

      const out = fs.createWriteStream(__dirname + '/output.png');
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on('finish', () => {
        api.sendMessage({
          body: "Here's your home",
          attachment: fs.createReadStream(__dirname + '/output.png')
        }, event.threadID, event.messageID);
      });
    }

    drawImages();
  }
};