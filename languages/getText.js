const languageData = require('./langs.js');
global.languageData = languageData;
global.getTextLang = global.VexaBot.config.lang;

function getText(key, ...params) {

  const langData = languageData[global.getTextLang]; 
  const text = langData[key] || ''; 
  if (!text) return `[🚫] Can\'t Find text for key "${key}" with given params.`;
  return text.replace(/%(\d+)/g, (match, index) => {
    const paramIndex = parseInt(index) - 1;
    return paramIndex >= 0 && paramIndex < params.length ? params[paramIndex] : match;
  });
};

global.getText = getText;

tr = async (text, lang) => {
  const textt = await global.utils.translateAPI(text, lang);
  return textt;
}