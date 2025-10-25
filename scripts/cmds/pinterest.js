const request = require('request');
let start = 9;
module.exports = {
  config: {
    name: "pin",
    aliases: ["بينتريست"],
    version: "1.0",
    author: "VexaTeam",
    countDown: 10,
    role: 0,
    shortDescription: { ar: "توليد صور من موقع بينتريست.", en: "get pictures from Pinterest" },
    category: "search",
    guide: { ar: "{pn} وصف", en: "{pn} prompt" }
  },

  langs: {
    ar: {
    done: "✅ إليك الصور.\n• عدد الصور التي وجدتها هي %1.",
    error: "❌ طرب طلب آخر.",
    needP: "عن مذا تريد البحث ؟",
    pictures_end: "خلصت الصور ✅",
    react: "سوي رياكشن لأرسل لك %1 صور أيضا '-'✅\n• إذا لاحظت تكرار في الصور فالأحسن تتوقف لأن الموقع يكرر الصور شوي 👽."
  },
    en: {
        done: "✅ Your images\nFound %1 images.\n• React to send next 10 pictures",
        error: "❌ try with another prompt.",
      needP: "Pictures of what you need ?",
      pictures_end: "Done ✅ pictures end",
      react: "✅'-' reaction to send %1 more picture.\n•If you notice repetition in the images, stop reacting because the site repeats the images frequently."
    }
  },

  atCall: async function ({ args, message, event, commandName, getLang }) {
    const prompt = args.join(' ');
    
    if (!args[0]) return message.reply(getLang("needP"));
    const streams = [];
    const res = await new Promise(resolve => {
        getPinterestPictures(prompt, resolve);
    });

    for (let i of res.data) {
        try {
          if (streams.includes(i)) continue;
        streams.push(await utils.getStreamFromUrl(i));
        } catch (e) {
            continue;
        }
    }

    if (streams.length == 0) return message.reply(getLang("error"));
    
    message.reply({ body: getLang("done", streams.length), attachment: streams.slice(0, 9) })
    .then(ev => global.VexaBot.atReact.set(ev.messageID, {
      commandName,
      streams,
      k: event.senderID
    }))
  },
  atReact: async function ({ Reaction, message, event, getLang }) {
    const { commandName, streams, k } = Reaction;
    if (k != event.userID) return;
    if (start >= streams.length) {
      message.reply(getLang("pictures_end"));
      return;
    }

    const slicedStreams = streams.slice(start, start + 9);
    message.reply({ body: getLang("react", slicedStreams.length), attachment: slicedStreams })
      .then(ev => { 
global.VexaBot.atReact.set(ev.messageID, {
          commandName,
          streams
        });
        start = start + 9;
      })
      .catch(error => {
        return; //message.reply(error.message);
      });
  }
};

function getPinterestPictures(query, callback) {
    const headers = {
        'authority': 'www.pinterest.com',
        'cache-control': 'max-age=0',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'sec-gpc': '1',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'same-origin',
        'sec-fetch-dest': 'empty',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': 'csrftoken=92c7c57416496066c4cd5a47a2448e28; g_state={"i_l":0}; _auth=1; _pinterest_sess=TWc9PSZBMEhrWHJZbHhCVW1OSzE1MW0zSkVid1o4Uk1laXRzdmNwYll3eEFQV0lDSGNRaDBPTGNNUk5JQTBhczFOM0ZJZ1ZJbEpQYlIyUmFkNzlBV2kyaDRiWTI4THFVUWhpNUpRYjR4M2dxblJCRFhESlBIaGMwbjFQWFc2NHRtL3RUcTZna1c3K0VjVTgyejFDa1VqdXQ2ZEQ3NG91L1JTRHZwZHNIcDZraEp1L0lCbkJWUytvRis2ckdrVlNTVytzOFp3ZlpTdWtCOURnbGc3SHhQOWJPTzArY3BhMVEwOTZDVzg5VDQ3S1NxYXZGUEEwOTZBR21LNC9VZXRFTkErYmtIOW9OOEU3ektvY3ZhU0hZWVcxS0VXT3dTaFpVWXNuOHhiQWdZdS9vY24wMnRvdjBGYWo4SDY3MEYwSEtBV2JxYisxMVVsV01McmpKY0VOQ3NYSUt2ZDJaWld6T0RacUd6WktITkRpZzRCaWlCTjRtVXNMcGZaNG9QcC80Ty9ZZWFjZkVGNURNZWVoNTY4elMyd2wySWhtdWFvS2dQcktqMmVUYmlNODBxT29XRWx5dWZSc1FDY0ZONlZJdE9yUGY5L0p3M1JXYkRTUDAralduQ2xxR3VTZzBveUc2Ykx3VW5CQ0FQeVo5VE8wTEVmamhwWkxwMy9SaTNlRUpoQmNQaHREbjMxRlRrOWtwTVI5MXl6cmN1K2NOTFNyU1cyMjREN1ZFSHpHY0ZCR1RocWRjVFZVWG9VcVpwbXNGdlptVzRUSkNadVc1TnlBTVNGQmFmUmtrNHNkVEhXZytLQjNUTURlZXBUMG9GZ3YwQnVNcERDak16Nlp0Tk13dmNsWG82U2xIKyt5WFhSMm1QUktYYmhYSDNhWnB3RWxTUUttQklEeGpCdE4wQlNNOVRzRXE2NkVjUDFKcndvUzNMM2pMT2dGM05WalV2QStmMC9iT055djFsYVBKZjRFTkRtMGZZcWFYSEYvNFJrYTZSbVRGOXVISER1blA5L2psdURIbkFxcTZLT3RGeGswSnRHdGNpN29KdGFlWUxtdHNpSjNXQVorTjR2NGVTZWkwPSZzd3cwOXZNV3VpZlprR0VBempKdjZqS00ybWM9; _b="AV+pPg4VpvlGtL+qN4q0j+vNT7JhUErvp+4TyMybo+d7CIZ9QFohXDj6+jQlg9uD6Zc="; _routing_id="d5da9818-8ce2-4424-ad1e-d55dfe1b9aed"; sessionFunnelEventLogged=1'
    };

    const options = {
        url: 'https://www.pinterest.com/search/pins/?q=' + encodeURI(query) + '&rs=typed&term_meta[]=' + encodeURI(query) + '%7Ctyped',
        headers: headers
    };

    function pinterestCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
            const arrMatch = body.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
      
            callback({
                count: arrMatch.length,
                data: arrMatch
            });
        } else {
            callback({ error: 'Pinterest request failed' });
        }
    }

    request(options, pinterestCallback);
}