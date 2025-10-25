const fs = require('fs');
const { loadImage } = require('canvas');

module.exports = {
  config: {
    name: 'cnvinf',
    aliases: ["ابعاد"],
    author: 'allou Mohamed',
    version: '1.0.0',
    role: 0,
    category: 'memes',
    guide: '{pn}',
    shortDescription: {
      en: 'get pic x y.',
      ar: 'حصل أبعاد صورة'
    }
  },
  atCall: async function({ message, args, event}) {
    const pic = event?.messageReply?.attachments?.[0]?.url || args[0] || false;
    if (!pic) return message.reply("reply to pic");
    const background = await loadImage(pic);

    const canvasWidth = background.width;
    const canvasHeight = background.height;
        message.reply({
            body: `H: ${canvasHeight}\nW: ${canvasWidth}`});
  }
};
