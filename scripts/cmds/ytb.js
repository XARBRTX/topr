const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs-extra");
const { getStreamFromURL, downloadFile, formatNumber } = global.utils;
async function getStreamAndSize(url, path = "") {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    headers: {
      'Range': 'bytes=0-'
    }
  });
  if (path)
    response.data.path = path;
  const totalLength = response.headers["content-length"];
  return {
    stream: response.data,
    size: totalLength
  };
}

module.exports = {
  config: {
    name: "ytb",
    aliases: ["يوتيوب"],
    version: "1.16",
    author: "allou",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "تحميل أغاني من يوتيوب",
      en: "Download video, audio or view video information on YouTube"
    },
    category: "صوت",
    guide: {ar: "   {pn} [فيديو|-v] [<اسم الفيديو>|<رابط الفيديو>]: لتحميل الفيديو من يوتيوب."
        + "\n   {pn} [صوت|-a] [<اسم الفيديو>|<رابط الفيديو>]: لتحميل الصوت من يوتيوب"
        + "\n   {pn} [معلومات|-i] [<اسم الفيديو>|<رابط الفيديو>]: لعرض معلومات الفيديو من يوتيوب"
        + "\n   مثال:"
        + "\n    {pn} -v kingdom"
        + "\n    {pn} -a kingdom"
        + "\n    {pn} -i kingdom",
en: "   {pn} [video|-v] [<video name>|<video link>]: use to download video from youtube."
        + "\n   {pn} [audio|-a] [<video name>|<video link>]: use to download audio from youtube"
        + "\n   {pn} [info|-i] [<video name>|<video link>]: use to view video information from youtube"
        + "\n   Example:"
        + "\n    {pn} -v Fallen Kingdom"
        + "\n    {pn} -a Fallen Kingdom"
        + "\n    {pn} -i Fallen Kingdom"
    }
  },

  langs: {
    ar: {
      error: "❌ حدث خطأ: %1",
      noResult: "⭕ لا توجد نتائج بحث مطابقة للكلمة الرئيسية %1",
      choose: "%1يرجى الرد على الرسالة بالرقم للاختيار أو قم بإرسال أي محتوى للإلغاء",
      video: "فيديو",
      audio: "صوت",
      downloading: "⬇️ يتم التنزيل %1 \"%2\"",
      downloading2: "⬇️ يتم التنزيل %1 \"%2\"\n🔃 السرعة: %3MB/s\n⏸️ تم التحميل: %4/%5MB (%6%)\n⏳ التقدير الزمني المتبقي: %7 ثانية",
      noVideo: "⭕ عذرًا، لم يتم العثور على أي فيديو بحجم أصغر من 83 ميغابايت",
      noAudio: "⭕ عذرًا، لم يتم العثور على أي صوت بحجم أصغر من 26 ميغابايت",
      info: "💠 العنوان: %1\n🏪 القناة: %2\n👨‍👩‍👧‍👦 المشتركين: %3\n⏱ مدة الفيديو: %4\n👀 عدد المشاهدات: %5\n👍 عدد الإعجابات: %6\n🆙 تاريخ الرفع: %7\n🔠 المعرف: %8\n🔗 الرابط: %9",
      listChapter: "\n📖 قائمة الفصول: %1\n"
    },
      en: {
      error: "❌ An error occurred: %1",
      noResult: "⭕ No search results match the keyword %1",
      choose: "%1Reply to the message with a number to choose or any content to cancel",
      video: "video",
      audio: "audio",
      downloading: "⬇️ Downloading %1 \"%2\"",
      downloading2: "⬇️ Downloading %1 \"%2\"\n🔃 Speed: %3MB/s\n⏸️ Downloaded: %4/%5MB (%6%)\n⏳ Estimated time remaining: %7 seconds",
      noVideo: "⭕ Sorry, no video was found with a size less than 83MB",
      noAudio: "⭕ Sorry, no audio was found with a size less than 26MB",
      info: "💠 Title: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Video duration: %4\n👀 View count: %5\n👍 Like count: %6\n🆙 Upload date: %7\n🔠 ID: %8\n🔗 Link: %9",
      listChapter: "\n📖 List chapter: %1\n"
    }
  },

  atCall: async function ({ args, message, event, commandName, getLang }) {
    let type;
    switch (args[0]) {
      case "-v":
      case "video":
        type = "video";
        break;
      case "أغنية":
      case "اغنية":
      case "audio":
      case "صوت":
        type = "audio";
        break;
      case "معلومات":
      case "info":
        type = "info";
        break;
      default:
        return message.err();
    }

    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const urlYtb = checkurl.test(args[1]);

    if (urlYtb) {
      const infoVideo = await getVideoInfo(args[1]);
      handle({ type, infoVideo, message, downloadFile, getLang });
      return;
    }

    let keyWord = args.slice(1).join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;

    let result;
    try {
      result = (await search(keyWord)).slice(0, maxResults);
    }
    catch (err) {
      return message.reply(getLang("error", err.message));
    }
    if (result.length == 0)
      return message.reply(getLang("noResult", keyWord));
    let msg = "";
    let i = 1;
    const thumbnails = [];
    const arrayID = [];

    for (const info of result) {
      thumbnails.push(getStreamFromURL(info.thumbnail));
      msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }

    message.reply({
      body: getLang("choose", msg),
      attachment: await Promise.all(thumbnails)
    }, (err, info) => {
      global.VexaBot.atReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        arrayID,
        result,
        type
      });
    });
  },

  atReply: async ({ event, api, Reply, message, getLang }) => {
    const { result, type } = Reply;
    const choice = event.body;
    if (!isNaN(choice) && choice <= 6) {
      const infoChoice = result[choice - 1];
      const idvideo = infoChoice.id;
      const infoVideo = await getVideoInfo(idvideo);
      api.unsendMessage(Reply.messageID);
      await handle({ type, infoVideo, message, getLang });
    }
    else
      api.unsendMessage(Reply.messageID);
  }
};

async function handle({ type, infoVideo, message, getLang }) {
  const { title, videoId } = infoVideo;

  if (type == "video") {
    const MAX_SIZE = 83 * 1024 * 1024; // 83MB (max size of video that can be sent on fb)
    const msgSend = message.reply(getLang("downloading", getLang("video"), title));
    const { formats } = await ytdl.getInfo(videoId);
    const getFormat = formats
      .filter(f => f.hasVideo && f.hasAudio && f.quality == 'tiny' && f.audioBitrate == 128)
      .sort((a, b) => b.contentLength - a.contentLength)
      .find(f => f.contentLength || 0 < MAX_SIZE);
    if (!getFormat)
      return message.reply(getLang("noVideo"));
    const getStream = await getStreamAndSize(getFormat.url, `${videoId}.mp4`);
    if (getStream.size > MAX_SIZE)
      return message.reply(getLang("noVideo"));

    const savePath = __dirname + `/tmp/${videoId}_${Date.now()}.mp4`;
    const writeStrean = fs.createWriteStream(savePath);
    const startTime = Date.now();
    getStream.stream.pipe(writeStrean);
    const contentLength = getStream.size;
    let downloaded = 0;
    let count = 0;

    getStream.stream.on("data", (chunk) => {
      downloaded += chunk.length;
      count++;
      if (count == 5) {
        const endTime = Date.now();
        const speed = downloaded / (endTime - startTime) * 1000;
        const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
        const percent = downloaded / contentLength * 100;
        if (timeLeft > 30) // if time left > 30s, send message
          message.reply(getLang("downloading2", getLang("video"), title, Math.floor(speed / 1000) / 1000, Math.floor(downloaded / 1000) / 1000, Math.floor(contentLength / 1000) / 1000, Math.floor(percent), timeLeft.toFixed(2)));
      }
    });
    writeStrean.on("finish", () => {
      message.reply({
        body: title,
        attachment: fs.createReadStream(savePath)
      }, async (err) => {
        if (err)
          return message.reply(getLang("error", err.message));
        fs.unlinkSync(savePath);
        message.unsend((await msgSend).messageID);
      });
    });
  }
  else if (type == "audio") {
    const MAX_SIZE = 27262976; // 26MB (max size of audio that can be sent on fb)
    const msgSend = message.reply(getLang("downloading", getLang("audio"), title));
    const { formats } = await ytdl.getInfo(videoId);
    const getFormat = formats
      .filter(f => f.hasAudio && !f.hasVideo)
      .sort((a, b) => b.contentLength - a.contentLength)
      .find(f => f.contentLength || 0 < MAX_SIZE);
    if (!getFormat)
      return message.reply(getLang("noAudio"));
    const getStream = await getStreamAndSize(getFormat.url, `${videoId}.mp3`);
    if (getStream.size > MAX_SIZE)
      return message.reply(getLang("noAudio"));

    const savePath = __dirname + `/tmp/${videoId}_${Date.now()}.mp3`;
    const writeStrean = fs.createWriteStream(savePath);
    const startTime = Date.now();
    getStream.stream.pipe(writeStrean);
    const contentLength = getStream.size;
    let downloaded = 0;
    let count = 0;

    getStream.stream.on("data", (chunk) => {
      downloaded += chunk.length;
      count++;
      if (count == 5) {
        const endTime = Date.now();
        const speed = downloaded / (endTime - startTime) * 1000;
        const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
        const percent = downloaded / contentLength * 100;
        if (timeLeft > 30) // if time left > 30s, send message
          message.reply(getLang("downloading2", getLang("audio"), title, Math.floor(speed / 1000) / 1000, Math.floor(downloaded / 1000) / 1000, Math.floor(contentLength / 1000) / 1000, Math.floor(percent), timeLeft.toFixed(2)));
      }
    });

    writeStrean.on("finish", () => {
      message.reply({
        body: title,
        attachment: fs.createReadStream(savePath)
      }, async (err) => {
        if (err)
          return message.reply(getLang("error", err.message));
        fs.unlinkSync(savePath);
        message.unsend((await msgSend).messageID);
      });
    });
  }
  else if (type == "info") {
    const { title, lengthSeconds, viewCount, videoId, uploadDate, likes, channel, chapters } = infoVideo;

    const hours = Math.floor(lengthSeconds / 3600);
    const minutes = Math.floor(lengthSeconds % 3600 / 60);
    const seconds = Math.floor(lengthSeconds % 3600 % 60);
    const time = `${hours ? hours + ":" : ""}${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    let msg = getLang("info", title, channel.name, formatNumber(channel.subscriberCount || 0), time, formatNumber(viewCount), formatNumber(likes), uploadDate, videoId, `https://youtu.be/${videoId}`);
    // if (chapters.length > 0) {
    // 	msg += getLang("listChapter")
    // 		+ chapters.reduce((acc, cur) => {
    // 			const time = convertTime(cur.start_time * 1000, ':', ':', ':').slice(0, -1);
    // 			return acc + ` ${time} => ${cur.title}\n`;
    // 		}, '');
    // }

    message.reply({
      body: msg,
      attachment: await Promise.all([
        getStreamFromURL(infoVideo.thumbnails[infoVideo.thumbnails.length - 1].url),
        getStreamFromURL(infoVideo.channel.thumbnails[infoVideo.channel.thumbnails.length - 1].url)
      ])
    });
  }
}

async function search(keyWord) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`;
    const res = await axios.get(url);
    const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
    const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const results = [];
    for (const video of videos)
      if (video.videoRenderer?.lengthText?.simpleText) // check is video, not playlist or channel or live
        results.push({
          id: video.videoRenderer.videoId,
          title: video.videoRenderer.title.runs[0].text,
          thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
          time: video.videoRenderer.lengthText.simpleText,
          channel: {
            id: video.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
            name: video.videoRenderer.ownerText.runs[0].text,
            thumbnail: video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
          }
        });
    return results;
  }
  catch (e) {
    const error = new Error("Cannot search video");
    error.code = "SEARCH_VIDEO_ERROR";
    throw error;
  }
}

async function getVideoInfo(id) {
  // get id from url if url
  id = id.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)/);
  id = id[2] !== undefined ? id[2].split(/[^0-9a-z_\-]/i)[0] : id[0];

  const { data: html } = await axios.get(`https://youtu.be/${id}?hl=en`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
    }
  });
  const json = JSON.parse(html.match(/var ytInitialPlayerResponse = (.*?});/)[1]);
  const json2 = JSON.parse(html.match(/var ytInitialData = (.*?});/)[1]);
  const { title, lengthSeconds, viewCount, videoId, thumbnail, author } = json.videoDetails;
  let getChapters;
  try {
    getChapters = json2.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.find(x => x.key == "DESCRIPTION_CHAPTERS" && x.value.chapters).value.chapters;
  }
  catch (e) {
    getChapters = [];
  }
  const owner = json2.contents.twoColumnWatchNextResults.results.results.contents.find(x => x.videoSecondaryInfoRenderer).videoSecondaryInfoRenderer.owner;

  const result = {
    videoId,
    title,
    video_url: `https://youtu.be/${videoId}`,
    lengthSeconds: lengthSeconds.match(/\d+/)[0],
    viewCount: viewCount.match(/\d+/)[0],
    uploadDate: json.microformat.playerMicroformatRenderer.uploadDate,
    // contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0].segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel.accessibilityText
    likes: json2.contents.twoColumnWatchNextResults.results.results.contents.find(x => x.videoPrimaryInfoRenderer).videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons.find(x => x.segmentedLikeDislikeButtonViewModel).segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel.accessibilityText.replace(/\.|,/g, '').match(/\d+/)?.[0] || 0,
    chapters: getChapters.map((x, i) => {
      const start_time = x.chapterRenderer.timeRangeStartMillis;
      const end_time = getChapters[i + 1]?.chapterRenderer?.timeRangeStartMillis || lengthSeconds.match(/\d+/)[0] * 1000;

      return {
        title: x.chapterRenderer.title.simpleText,
        start_time_ms: start_time,
        start_time: start_time / 1000,
        end_time_ms: end_time - start_time + start_time,
        end_time: (end_time - start_time + start_time) / 1000
      };
    }),
    thumbnails: thumbnail.thumbnails,
    author: author,
    channel: {
      id: owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.browseId,
      username: owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
      name: owner.videoOwnerRenderer.title.runs[0].text,
      thumbnails: owner.videoOwnerRenderer.thumbnail.thumbnails,
      subscriberCount: parseAbbreviatedNumber(owner.videoOwnerRenderer.subscriberCountText.simpleText)
    }
  };

  return result;
}

function parseAbbreviatedNumber(string) {
  const match = string
    .replace(',', '.')
    .replace(' ', '')
    .match(/([\d,.]+)([MK]?)/);
  if (match) {
    let [, num, multi] = match;
    num = parseFloat(num);
    return Math.round(multi === 'M' ? num * 1000000 :
      multi === 'K' ? num * 1000 : num);
  }
  return null;
}