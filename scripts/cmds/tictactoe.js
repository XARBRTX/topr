// TIC TAC TOE LOGIC:
const board = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9
];

function findIndex(arr, element) {
  return arr.indexOf(element);
}

/*function fb(t) {
  const bord = Array(9).fill('⬜');

  t.forEach((i, index) => {
    if (!isNaN(i)) bord[i - 1] = '⬜';
    if (i === 'x') bord[index] = '🔴';
    if (i === 'o') bord[index] = '🔵';
    if (i === 'w') bord[index] = '🟩';
  });

  return bord[0] + bord[1] + bord[2] + '\n' + bord[3] + bord[4] + bord[5] + '\n' + bord[6] + bord[7] + bord[8];
}*/function fb(t) {
  const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  const bord = Array(9).fill('🔲');

  t.forEach((i, index) => {
    if (!isNaN(i)) bord[i - 1] = emojis[i - 1];
    if (i === 'x') bord[index] = '❌';
    if (i === 'o') bord[index] = '⭕';
    if (i === 'w') bord[index] = '🟩';
  });

  return bord[0] + bord[1] + bord[2] + '\n' + bord[3] + bord[4] + bord[5] + '\n' + bord[6] + bord[7] + bord[8];
}


const tttData = {};

function cv(t, n) {
  if (t[n] === "x") return "x";
  if (t[n] === "o") return "o";
  return t[n];
}

function wd(t) {
  const a = cv(t, 0);
  const b = cv(t, 1);
  const c = cv(t, 2);
  const d = cv(t, 3);
  const e = cv(t, 4);
  const f = cv(t, 5);
  const g = cv(t, 6);
  const h = cv(t, 7);
  const i = cv(t, 8);

  if ((a === b && b === c) || (d === e && e === f) || (g === h && h === i) || (a === d && d === g) || (b === e && e === h) || (c === f && f === i) || (a === e && e === i) || (c === e && e === g)) {
    let winCells;
    if (a === b && b === c) {
      winCells = [0, 1, 2];
    } else if (d === e && e === f) {
      winCells = [3, 4, 5];
    } else if (g === h && h === i) {
      winCells = [6, 7, 8];
    } else if (a === d && d === g) {
      winCells = [0, 3, 6];
    } else if (b === e && e === h) {
      winCells = [1, 4, 7];
    } else if (c === f && f === i) {
      winCells = [2, 5, 8];
    } else if (a === e && e === i) {
      winCells = [0, 4, 8];
    } else if (c === e && e === g) {
      winCells = [2, 4, 6];
    }

    winCells.forEach(cell => {
      t[cell] = 'w';
    });

    return { win: true, draw: false, winCells: winCells };
  }

  let draw = 0;

  t.forEach(i => {
    if (typeof i === "string") draw++;
  });

  if (draw === 9) {
    return { win: false, draw: true };
  }
  return { win: false, draw: false };
}

module.exports = {
  config: {
    name: "تحدي",
    version: "1.1",
    author: "allou mohamed",
    countDown: 5,
    role: 0,
    description: "لعبة إكس أو",
    category: "ألعاب",
    guide: "{pn} رد على شخص"
  },

  atCall: async function ({ event, message, args, commandName, usersData }) {
    // Load the data 👽
    if (!tttData[event.threadID]) tttData[event.threadID] = {};

    if (event.type !== "message_reply") return message.reply('Please reply to your friend');

    if (tttData[event.threadID].game) return message.reply('👽 a game already running in this group wait');

    tttData[event.threadID].game = true;

    tttData[event.threadID][event.senderID] = 'x';
    tttData[event.threadID].player_one = event.senderID;

    tttData[event.threadID].player_two = event.messageReply.senderID;
    tttData[event.threadID][event.messageReply.senderID] = 'o';
    tttData[event.threadID].currentSymbol = 'x';

    tttData[event.threadID].bord = board;

    /*
    🔲🔲🔲
    🔲🔲🔲
    🔲🔲🔲
    */
    const p1 = await usersData.getName(event.senderID);
    const p2 = await usersData.getName(event.messageReply.senderID);
    message.send({body: `😎 Game started between:\nYou ${p1} "x" You start first VS ${p2} "o" The second player.\n\nThe winner got 2000 $ 🤑`, mentions:[{id:event.senderID, tag:p1}, {id:event.messageReply.senderID, tag:p2}]})
    message.reply(fb(tttData[event.threadID].bord), (e, i) => {
      global.VexaBot.atReply.set(i.messageID, {
        commandName
      });
    });
  },

  atReply: async function ({ event, message, args, Reply, usersData }) {
    const { commandName } = Reply;
    const player = event.senderID;
    const nameP = await usersData.getName(player);
    const playerSymbol = tttData[event.threadID][player];
    let currentSymbol = tttData[event.threadID].currentSymbol;

    // Check turn
    if (playerSymbol !== currentSymbol) return message.reply('👽 not your turn');

    // Check valid move
    const a = args[0];
    const move = parseInt(a);
    if (isNaN(move) || move > 9 || move < 1 || isNaN(tttData[event.threadID].bord[move - 1])) return message.reply('👽 Use the potato you have in your head');

    // Update the board
    tttData[event.threadID].bord[move - 1] = playerSymbol;
    //
console.log(tttData[event.threadID].bord);
    //
    // Check win or draw
    const { win, draw } = wd(tttData[event.threadID].bord);
    if (win) {
      message.reply({body: '😎 The winner is ' + nameP, mentions:[{id:player, tag:nameP}]});
      const { winCells } = wd(tttData[event.threadID].bord);
      const a = winCells[0];
      const b = winCells[1];
      const c = winCells[2];

      // Update the board
      tttData[event.threadID].bord[a] = 'w';
      tttData[event.threadID].bord[b] = 'w';
      tttData[event.threadID].bord[c] = 'w';
    }
    if (draw) {
      message.reply('🐸 nubs ._.');
    }

    // Update the current symbol
    tttData[event.threadID].currentSymbol = currentSymbol === 'x' ? 'o' : 'x';

    // Send the board again
    message.reply(fb(tttData[event.threadID].bord), (e, i) => {
      if (e) return;
    global.VexaBot.atReply.set(i.messageID, {
        commandName
      });
    });
  }
};
