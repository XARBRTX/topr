const { spawn } = require("child_process");
const gradient = require("gradient-string");
const log = require("./logger/log.js");
/*
function centerText(text, length) {
  const width = process.stdout.columns;
  const leftPadding = Math.floor((width - (length || text.length)) / 2);
  const rightPadding = width - leftPadding - (length || text.length);
  const paddedString = ' '.repeat(leftPadding > 0 ? leftPadding : 0) + text + ' '.repeat(rightPadding > 0 ? rightPadding : 0);
  console.log(paddedString);
}

const currentVersion = require("./package.json").version;

const titles = [
  
  [
   "█ █ █▀▀ ▀▄▀ ▄▀█   █▄▄ █▀█ ▀█▀",
   "▀▄▀ ██▄ █ █ █▀█   █▄█ █▄█  █ "
  ]
  
];
const maxWidth = process.stdout.columns;
const title = titles[0];

for (const text of title) {
  const textColor = gradient("#8BC8FF", "#FF2B66", "#FD2BFF")(text);
  centerText(textColor, text.length);
}//old color: "#FA8BFF", "#2BD2FF", "#2BFF88"

let subTitle = `Vexa V-${currentVersion} - The Best Messenger BotChat`;
const subTitleArray = [];
if (subTitle.length > maxWidth) {
  while (subTitle.length > maxWidth) {
    let lastSpace = subTitle.slice(0, maxWidth).lastIndexOf(' ');
    lastSpace = lastSpace == -1 ? maxWidth : lastSpace;
    subTitleArray.push(subTitle.slice(0, lastSpace).trim());
    subTitle = subTitle.slice(lastSpace).trim();
  }
  subTitle ? subTitleArray.push(subTitle) : '';
} else {
  subTitleArray.push(subTitle);
}

const author = 'Created by MA Team';
const by = 'Allou Mohamed';

for (const t of subTitleArray) {
  const textColor2 = gradient("#8BC8FF", "#FF2B66", "#FD2BFF")(t);//old color: "#9F98E8", "#AFF6CF"
  centerText(textColor2, t.length);
}

centerText(gradient("#8BC8FF", "#FF2B66", "#FD2BFF")(author), author.length);
centerText(gradient("#8BC8FF", "#FF2B66", "#FD2BFF")(by), by.length);

*/
function startProject() {
  const child = spawn("node", ["vexa.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code == 2) {
      log.warn("Restarting Project...");
      startProject();
    }
    if (!code) {
      process.exit();
    }
  });
}

startProject();
