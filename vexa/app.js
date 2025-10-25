const express = require('express');
const fs = require("fs-extra");
const querystring = require("querystring");
const app = express();
const PORT = 8080;
let responses = {};

try {
  const jsonFile = fs.readFileSync(__dirname + "/core/yuki/yuki.json", "utf-8");
  responses = JSON.parse(jsonFile);
  log.info("Loaded chatbot ai Yuki (:")
} catch (error) {
  console.error("Error reading JSON file:", error);
}

app.use(express.json());

module.exports = async ({ usersData, threadsData }) => {
  
  app.get("/", async (req, res) => {
    const allUsers = await usersData.getAll();
    const usersCount = allUsers.length;
    const allThreads = await threadsData.getAll();
    const groupsCount = allThreads.length;
      res.status(200).json({
        BOT_USERS: usersCount,
        BOT_GROUPS: groupsCount,
        AUTHOR: 'ALLOU MOHAMED && Saad Rehat',
        CONTACT: 'facebook.com/proarcoder'
      });
  });

  app.get("/teach", (req, res) => {

  
  const { word, responsesToAdd } = req.query;

  if (!word || !responsesToAdd) {
    return res
      .status(400)
      .json({ error: "Both 'word' and 'responsesToAdd' fields are required." });
  }
  
  const responsesToAddArray = querystring.unescape(responsesToAdd).split(",");

  const lowercaseWord = word.toLowerCase();
  if (!responses[lowercaseWord]) {
    responses[lowercaseWord] = [];
  }

  responses[lowercaseWord].push(...responsesToAddArray);
  fs.writeFileSync(
    __dirname + "/core/yuki/yuki.json",
    JSON.stringify(responses, null, 4),
    "utf-8"
  );
   
  const addedResponsesMessage = `Responses added successfully for word "${word}"!`;
  console.log(addedResponsesMessage);
  
  res.json({ response: addedResponsesMessage });
});


app.get("/yuki", (req, res) => {
  const { word } = req.query;
  
  if (!word) {
    return res
      .status(400)
      .json({ error: "'word' query parameter is required." });
  }
  
  const author = ["allou mohamed", "author", "من صنعك", "طورك", "المطور", "المبرمج", "الصانع", "أبوك", "صنعك", "طورك", "مطور", "مالك", "مالكك", "المالك", "شيكورك"];

  if (author.includes(word) || author.includes(word.toLowerCase())) {
     res.json({ response: 'شهر رمضان صلي على رسول الله صلى الله عليه و سلم.\n\nلايهم من طورني المهم الحسنات 🌝🤍 و لا تصدق الأشخاص و الروابط التي ارسلها لك و اقول لك مطوري و مدري ايش كلهم حمقى زي ميدوريا 👽✓ \nصحا فطورك خو و سحورك.'  });
    return;
    }

  
  const bestMatch = calculateBestMatch(word, responses);
  if (!bestMatch) {
    const teachMessage = `Tech Bot "${word}"`;
    console.log(teachMessage);
    return res.json({ response: `علمني كيف أرد على "${word}"` });
  }

  const randomIndex = getRandomIndex(bestMatch.length);
  const responseMessage = bestMatch[randomIndex];
  console.log(responseMessage);
  return res.json({ response: bestMatch[randomIndex]  });
});
  
  app.listen(PORT, () => {
    log.info(`Server is running on port ${PORT}`);
  });
}
function calculateBestMatch(input, responses) {
  const inputWords = input.toLowerCase().split(" ");
  let bestMatch = null;
  let bestMatchScore = 0;

  for (const response in responses) {
    const responseWords = response.split(" ");
    let commonWords = 0;

    for (const inputWord of inputWords) {
      if (responseWords.includes(inputWord)) {
        commonWords++;
      }
    }

    const similarityScore = commonWords / responseWords.length;
    if (similarityScore > bestMatchScore) {
      bestMatch = responses[response];
      bestMatchScore = similarityScore;
    }
  }

  return bestMatch;
}

function getRandomIndex(arrayLength) {
  const randomIndex = Math.floor(Math.random() * arrayLength);
  return randomIndex;
        }
    