const Canvas = require('canvas');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const sizeOf = require('image-size');
const fs = require("fs");

async function downloadImage(url, filename) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        //console.log(__dirname);
        response.data.pipe(fs.createWriteStream(__dirname+"/core/unityCache/"+filename));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve();
            });
            response.data.on('error', (err) => {
                reject(err);
            });
        });
    } catch (error) {
        throw new Error(`Error downloading image: ${error}`);
    }
}


async function upscale(img) {
    try {
        const grn = function(min, max) { 
            return Math.floor(Math.random() * (max - min + 1)) + min; 
        };

        const response = await axios.get(img, { responseType: 'arraybuffer' });
        const dimensions = sizeOf(response.data);

        const { width, height } = dimensions;

        const buffer = Buffer.from(response.data);

        const formData = new FormData();
        formData.append('image_file', buffer, {
            filename: 'image.jpg',
            contentType: 'image/jpg',
        });
        formData.append('name', grn(1000000, 999292220822));
        formData.append('desiredHeight', height * 4);
        formData.append('desiredWidth', width * 4);
        formData.append('outputFormat', 'png');
        formData.append('compressionLevel', 'None');
        formData.append('anime', 'False');

        const apiUrl = 'https://api.upscalepics.com/upscale-to-size';

        const respon = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                'Referer': 'https://upscalepics.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
        });

            const X = Date.now();
      await downloadImage(respon.data.bgRemoved, `up-${X}.png`);
              return `${__dirname}/core/unityCache/up-${X}.png`;
    } catch (error) {
        return;
    }
}

/*
async function upscale(img) {
    try {
        const get_stream = await axios.get(img, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(get_stream.data, 'binary');
        const a_name = uuidv4();
        const an_img_name = `${a_name}_image`;
        const formData = new FormData();
        formData.append('image_file', imageData, { filename: 'image.jpeg' });
        formData.append('name', a_name);
        formData.append('imageName', an_img_name);
        formData.append('desiredHeight', '4096');
        formData.append('desiredWidth', '4096');
        formData.append('outputFormat', 'jpeg');
        formData.append('compressionLevel', 'Low');
        formData.append('anime', 'False');
        const response = await axios.post('https://api.upscalepics.com/upscale-to-size', formData, {
            headers: {
                ...formData.getHeaders(),
                'Referer': 'https://upscalepics.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            }
        });
      const X = Date.now();
await downloadImage(response.data.bgRemoved, `up-${X}.png`);
        return `${__dirname}/core/unityCache/up-${X}.png`;
    } catch (error) {
        console.error(error);
        throw error;
    }
}*/

const apiKey = "AIzaSyAf6WhMi1RpI6C3MCp3EZA36Mx7PXS_0vU";

async function GMNPRO(P,H) {
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-pro" });
  let HI = "";
  if (H.length > 0) HI = ['chat history:\n'];
  for (let i = 0; i < H.length; i++) {
  HI += i+1+"- "+H[i]+"."+"\n"
  }
  const result = await model.generateContent(P+"\n\n"+HI);
  console.log(P+"\n\n"+HI);
  return result.response.text();
}

async function countToken(input) {
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-pro" });
  const response = await model.countTokens(input);
  return response.totalTokens;
}

async function GMN(prompt, imageUrl = null) {
  try {
    const model = imageUrl ? 
      new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-pro-vision" }) :
      new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-pro" });

    if (imageUrl) {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data, "binary");
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      };
      const result = await model.generateContent([prompt, imagePart]);
      return result.response.text();
    } else {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    throw new Error(`Error generating content: ${error.message}`);
  }
}

 function formatTimestamp(timestamp, timeZone) {
   let time;
   if (timeZone) {
     time = timeZone;
   } else {
     time = 'Africa/Algiers';
   }
  const options = {
    timeZone: time,
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  };

  const formattedDate = new Date(timestamp).toLocaleString('en-US', options);
  return formattedDate;
}

function BoldText(text) {
    const replacements = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
        'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
        'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
        'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
        'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
        'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
        'Y': '𝗬', 'Z': '𝗭',
        'À': '𝗔', 'Á': '𝗔', 'Ä': '𝗔', 'Æ': '𝗔', 'Å': '𝗔',
        'á': '𝗮'
    };

    const regex = new RegExp(Object.keys(replacements).join('|'), 'g');
    
    return text.replace(regex, match => replacements[match]);
}
function getUserOrder(userID, userDataArray) {
  const sortedData = userDataArray.sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const userIndex = sortedData.findIndex(user => user.userID === userID);
  if (userIndex !== -1) {
  
    return userIndex + 1;
  } else {
    return -1; 
  }
}

function outOrder(userID, us) {
  const userOrder = global.yuki.getUserOrder(userID, us);
  if (userOrder !== -1) {
    return userOrder;
  } else {
    return `• ${userID} not found.`;
  }
}

function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}

function generateRandomText() {
  const randomWords = ["أنا بخير طالما الأشياء الصغيرة تبهجني ☁💙\nⁱ'ᵐ ᶠⁱⁿᵉ ᵃˢ ˡᵒⁿᵍ ᵃˢ ˡⁱᵗᵗˡᵉ ᵗʰⁱⁿᵍˢ ᵐᵃᵏᵉ ᵐᵉ ʰᵃᵖᵖʸ ☁💙", "غباء منك أن تكون حزينا، بسبب شخص يعيش حياته بكل سعادة 🖤📜\n𝐈𝐭'𝐬 𝐬𝐭𝐮𝐩𝐢𝐝 𝐨𝐟 𝐲𝐨𝐮 𝐭𝐨 𝐛𝐞 𝐬𝐚𝐝, 𝐛𝐞𝐜𝐚𝐮𝐬𝐞 𝐨𝐟 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐰𝐡𝐨 𝐥𝐢𝐯𝐞𝐬 𝐡𝐢𝐬 𝐥𝐢𝐟𝐞 𝐡𝐚𝐩𝐩𝐢𝐥𝐲 🖤📜", "لا أريد أن أشهد غيابك، أريد أن أغيب معه 🙂❤\n𝐈 𝐃𝐎𝐍'𝐓 𝐖𝐀𝐍𝐓 𝐓𝐎 𝐖𝐈𝐓𝐍𝐄𝐒𝐒 𝐘𝐎𝐔𝐑 𝐀𝐁𝐒𝐄𝐍𝐂𝐄, 𝐈 𝐖𝐀𝐍𝐓 𝐓𝐎 𝐁𝐄 𝐀𝐁𝐒𝐄𝐍𝐓 𝐖𝐈𝐓𝐇 𝐈𝐓 🙂❤", "في وقت الشدة فقط، تعرف من هم أحبابك ومن هم حثالة اختيارك 😑💙\n𝖮𝗇𝗅𝗒 𝗂𝗇 𝗍𝗂𝗆𝖾𝗌 𝗈𝖿 𝗍𝗋𝗈𝗎𝖻𝗅𝖾, 𝗒𝗈𝗎 𝗄𝗇𝗈𝗐 𝗐𝗁𝗈 𝗒𝗈𝗎𝗋 𝗅𝗈𝗏𝖾𝖽 𝗈𝗇𝖾𝗌 𝖺𝗋𝖾 𝖺𝗇𝖽 𝗐𝗁𝗈 𝖺𝗋𝖾 𝗍𝗁𝖾 𝗌𝖼𝗎𝗆 𝗈𝖿 𝗒𝗈𝗎𝗋 𝖼𝗁𝗈𝗂𝖼𝖾 😑💙", "الأفضل أن تعرف المخرج قبل أن تغامر 👻⛈️\nℬℯ𝓉𝓉ℯ𝓇 𝓉ℴ 𝓀𝓃ℴ𝓌 𝓉𝒽ℯ ℯ𝓍𝒾𝓉 𝒷ℯ𝒻ℴ𝓇ℯ 𝓎ℴ𝓊 𝓋ℯ𝓃𝓉𝓊𝓇ℯ 👻⛈️", "دائما تأكد بأنه في ذات الوقت الذي يراك أحدهم هامشا، هناك آخر يراك أمنيته 😐❤️‍🩹\nᵃˡʷᵃʸˢ ᵐᵃᵏᵉ ˢᵘʳᵉ ᵗʰᵃᵗ ᵃᵗ ᵗʰᵉ ˢᵃᵐᵉ ᵗⁱᵐᵉ ˢᵒᵐᵉᵒⁿᵉ ˢᵉᵉˢ ʸᵒᵘ ᵃˢ ᵃ ˢⁱᵈᵉˡⁱⁿᵉ, ᵗʰᵉʳᵉ ⁱˢ ᵃⁿᵒᵗʰᵉʳ ʷʰᵒ ˢᵉᵉˢ ʸᵒᵘ ᵃˢ ʰⁱˢ ʷⁱˢʰ 😐❤️‍🩹", "الغريب في عقلك أنه لا يعمل سوى ليؤنب قلبك على أخطائه 😹🤞🏻\n𝑻𝒉𝒆 𝒔𝒕𝒓𝒂𝒏𝒈𝒆 𝒕𝒉𝒊𝒏𝒈 𝒊𝒏 𝒚𝒐𝒖𝒓 𝒎𝒊𝒏𝒅 𝒊𝒔 𝒕𝒉𝒂𝒕 𝒊𝒕 𝒐𝒏𝒍𝒚 𝒘𝒐𝒓𝒌𝒔 𝒕𝒐 𝒔𝒄𝒐𝒍𝒅 𝒚𝒐𝒖𝒓 𝒉𝒆𝒂𝒓𝒕 𝒇𝒐𝒓 𝒊𝒕𝒔 𝒎𝒊𝒔𝒕𝒂𝒌𝒆𝒔 😹🤞🏻", "Løü Fï هو صانع البوت 😊\nيا أخي أرجوك لا تكثر 👀❤️\nplease don't spam my bot 🙂❤️", "جرب أن تكون ملتزما أحيانا 👨🏻‍🚀🌵\n𝗧𝗥𝗬 𝗧𝗢 𝗕𝗘 𝗢𝗕𝗦𝗘𝗥𝗩𝗔𝗡𝗧 𝗦𝗢𝗠𝗘𝗧𝗜𝗠𝗘𝗦 👨🏻‍🚀🌵", "وفي صباح الجمعة، اللهم بشرنا بما تتمناه قلوبنا 🥺🤲🏻\n𝘼𝙣𝙙 𝙤𝙣 𝙁𝙧𝙞𝙙𝙖𝙮 𝙢𝙤𝙧𝙣𝙞𝙣𝙜, 𝙢𝙖𝙮 𝘼𝙡𝙡𝙖𝙝 𝙜𝙞𝙫𝙚 𝙪𝙨 𝙜𝙤𝙤𝙙 𝙣𝙚𝙬𝙨 𝙤𝙛 𝙬𝙝𝙖𝙩 𝙤𝙪𝙧 𝙝𝙚𝙖𝙧𝙩𝙨 𝙙𝙚𝙨𝙞𝙧𝙚 🥺🤲🏻", "لا تكن شخصا لطيفا، فهذا العالم وقح جدا 📜💫\nᴅᴏɴ'ᴛ ʙᴇ ᴀ ɴɪᴄᴇ ᴘᴇʀsᴏɴ, ᴛʜɪs ᴡᴏʀʟᴅ ɪs ᴠᴇʀʏ ʀᴜᴅᴇ 📜💫", "حتى لو كان وباؤهم ينتشر، فهو لن يشملك لأنك أقوى 🦾💉\nᵉᵛᵉⁿ ⁱᶠ ᵗʰᵉⁱʳ ᵉᵖⁱᵈᵉᵐⁱᶜ ˢᵖʳᵉᵃᵈˢ, ⁱᵗ ʷⁱˡˡ ⁿᵒᵗ ⁱⁿᶜˡᵘᵈᵉ ʸᵒᵘ ᵇᵉᶜᵃᵘˢᵉ ʸᵒᵘ ᵃʳᵉ ˢᵗʳᵒⁿᵍᵉʳ 🦾💉", "أنا لا أفكر بالمستقبل، لأنه يأتي بسرعة 🙃🥂\n𝐈 𝐝𝐨𝐧'𝐭 𝐭𝐡𝐢𝐧𝐤 𝐚𝐛𝐨𝐮𝐭 𝐟𝐮𝐭𝐮𝐫𝐞, 𝐛𝐞𝐜𝐚𝐮𝐬𝐞 𝐢𝐭 𝐜𝐨𝐦𝐞𝐬 𝐬𝐨 𝐟𝐚𝐬𝐭 🙃🥂", "قد لا أكون حبك الأول، ولكني أريد أن أكون الأخير 🥺🤍\n𝘔𝘢𝘺 𝘐'𝘮 𝘯𝘰𝘵 𝘺𝘰𝘶𝘳 𝘧𝘪𝘳𝘴𝘵 𝘭𝘰𝘷𝘦, 𝘣𝘶𝘵 𝘐 𝘸𝘢𝘯𝘵 𝘵𝘰 𝘣𝘦 𝘵𝘩𝘦 𝘭𝘢𝘴𝘵 🥺🤍", "سأحبك حتى عندما تكره نفسك 🌝🤎\n𝗜 𝘄𝗶𝗹𝗹 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 𝗲𝘃𝗲𝗻 𝘄𝗵𝗲𝗻 𝘆𝗼𝘂 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂𝗿𝘀𝗲𝗹𝗳 🌝🤎", "اشتقنا لأناس كانوا سعادتنا... كانوا حياتنا... كانوا كل شيء 💛🤧\nᴡᴇ ᴍɪssᴇᴅ ᴘᴇᴏᴘʟᴇs ᴡᴇʀᴇ ᴏᴜʀ ʜᴀᴘɪɴᴇss... ᴡᴇʀᴇ ᴏᴜʀ ʟɪғᴇ... ᴡᴇʀᴇ ᴇᴠᴇʀʏᴛʜɪɴɢ 💛🤧", "ما أخفته القلوب أظهرته المواقف 🌝🪞\n𝔚𝔥𝔞𝔱 𝔦𝔰 𝔥𝔦𝔡𝔡𝔢𝔫 𝔦𝔫 𝔥𝔢𝔞𝔯𝔱𝔰 𝔰𝔥𝔬𝔴𝔫 𝔦𝔫 𝔞𝔱𝔱𝔦𝔱𝔲𝔡𝔢𝔰 🌝🪞", "قد يمنحك القدر شخصاً يعيد لك إتزان قلبك 💚🌾\n𝖬𝖺𝗒 𝖽𝖾𝗌𝗍𝗂𝗇𝗒 𝗀𝗂𝗏𝖾𝗌 𝗒𝗈𝗎 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗐𝗁𝗈 𝗋𝖾𝗌𝗍𝗈𝗋𝖾𝗌 𝗍𝗁𝖾 𝖻𝖺𝗅𝖺𝗇𝖼𝖾 𝗈𝖿 𝗒𝗈𝗎𝗋 𝗁𝖾𝖺𝗋𝗍", "مرهق وكأني عشت ألف حزن، بألف شخص، بألف ألم 😓🖤☄️\nᴡᴇᴀʀʏ ᴀs ɪғ ɪ ʟɪᴠᴇᴅ ᴀ ᴛʜᴏᴜsᴀɴᴅ sᴏʀʀᴏᴡs, ᴀ ᴛʜᴏᴜsᴀɴᴅ ᴘᴇᴏᴘʟᴇ, ᴀ ᴛʜᴏᴜsᴀɴᴅ ᴘᴀɪɴ 😓🖤☄️", "اللهم خيرا، في كل اختيار 🤲🏻💙🎐\n𝙾𝙷 𝙶𝙾𝙳, 𝙶𝙾𝙾𝙳 𝙸𝙽 𝙴𝚅𝙴𝚁𝚈 𝙲𝙷𝙾𝙸𝙲𝙴 🤲🏻💙🎐", "صلي على ❤️ رسول الله 🤍 صلى الله عليه و على آله وسلم ❤️", "ولو تخلى عنك الكون كله، فأنا موجود 😌💛\n𝑨𝒏𝒅 𝒊𝒇 𝒕𝒉𝒆 𝒘𝒉𝒐𝒍𝒆 𝒖𝒏𝒊𝒗𝒆𝒓𝒔𝒆 𝒂𝒃𝒂𝒏𝒅𝒐𝒏𝒆𝒅 𝒚𝒐𝒖, 𝑰 𝒆𝒙𝒊𝒔𝒕 😌💛", "الجبناء لا يخوضون المعارك أصلا 🤧🎐\n𝘊𝘰𝘸𝘢𝘳𝘥𝘴 𝘥𝘰𝘯'𝘵 𝘦𝘷𝘦𝘯 𝘧𝘪𝘨𝘩𝘵 𝘣𝘢𝘵𝘵𝘭𝘦𝘴 🤧🎐"];

  return randomWords[Math.floor(Math.random() * randomWords.length)];
}


async function post(api, text, message) {
     if (!text) return message.reply('Provide the text.')
      const post = {
      input: {
        composer_entry_point: "inline_composer",
        composer_source_surface: "timeline",
        source: "WWW",
        attachments: [],
        audience: {
          privacy: {
            allow: [],
            base_state: "EVERYONE",
            deny: [],
            tag_expansion_state: "UNSPECIFIED"
          }
        },
        message: {
          ranges: [],
          text: text
        },
        with_tags_ids: [],
        inline_activities: [],
        explicit_place_id: "0",
        text_format_preset_id: "0",
        logging: {
          composer_session_id: getGUID()
        },
        tracking: [null],
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.floor(Math.random() * 17)
      },
      displayCommentsFeedbackContext: null,
      displayCommentsContextEnableComment: null,
      displayCommentsContextIsAdPreview: null,
      displayCommentsContextIsAggregatedShare: null,
      displayCommentsContextIsStorySet: null,
      feedLocation: "TIMELINE",
      feedbackSource: 0,
      focusCommentID: null,
      gridMediaWidth: 230,
      groupID: null,
      scale: 3,
      privacySelectorRenderLocation: "COMET_STREAM",
      renderLocation: "timeline",
      useDefaultActor: false,
      inviteShortLinkKey: null,
      isFeed: false,
      isFundraiser: false,
      isFunFactPost: false,
      isGroup: false,
      isTimeline: true,
      isSocialLearning: false,
      isPageNewsFeed: false,
      isProfileReviews: false,
      isWorkSharedDraft: false,
      UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
      hashtag: null,
      canUserManageOffers: false
    };

      api.httpPost(
        "https://www.facebook.com/api/graphql/",
        {
          av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "7711610262190099",
        variables: JSON.stringify(post)
        },
        (error, info) => {
          if (error) {
            console.error(error);
            return;
          }

          try {
            info = JSON.parse(info.replace("for (;;);", ""));
            
            const postID = info.data.story_create.story.legacy_story_hideable_id;
            const urlPost = info.data.story_create.story.url;

            return message.reply(`✅ Post ID: ${postID}\n🔗 Post Link: ${urlPost}`);
          } catch (error) {
          console.error(error);
          }
        }
      );
    }

function Li(text) {
    const maxLength = 28+6+1;
    const lineLength = maxLength + 4;
    const paddingLength = Math.floor((lineLength - text.length) / 2);
    const padding = "─".repeat(paddingLength - 1); 
    const colorCode = "\x1b[93m"; 
    const resetCode = "\x1b[0m"; 

    if (text.length >= maxLength) {
        return text.substring(0, maxLength); 
    } else {
        const result = " " + padding + " " + text + " " + padding + " ";
        let coloredResult = colorCode + result + resetCode;
        return coloredResult.length <= lineLength ? coloredResult : coloredResult.substring(0, lineLength); 
    }
}


const newUtils = {
  BoldText,
  outOrder,
  getUserOrder,
  getStampDate: formatTimestamp,
  generateRandomText,
  post,
  GMN,
  GMNPRO,
  Li,
  upscale
};

module.exports = newUtils;