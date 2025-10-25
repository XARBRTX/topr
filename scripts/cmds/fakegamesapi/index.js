const s = require('./QSR.js');
const s_b = require('./ORD.js');
const s_c = require('./Flag.js');
const x = s_c.ar_f;
const c = s.c;
const d = s_b.c;
const H = s.h;
const حزورات = require('./QS.js');
const B = حزورات.QS;
const data = new Map();
const cs = {};

async function QSR(playerID, Answer) {
  if (!playerID) return { message: "bad request" };
  
  const ID = playerID;
  const AN = Answer;

  if (!data.get(ID)) {
    data.set(ID, {
      score: 0
    });
    cs[ID] = 0;
    return {
      message: H + "\n🔌 سيرفر Allou Mohamed"
    };
  }
  const { score } = data.get(ID);
  let currentQs = cs[ID] || 0;
  const QuestionOBJ = c[currentQs];

  const Question = `📍 ${QuestionOBJ.QS}:\n\n1_❏ ${QuestionOBJ.A.action}\n2_❏ ${QuestionOBJ.B.action}\n3_❏ ${QuestionOBJ.C.action}\n\n❏ المرحلة: 【 ${currentQs + 1} 】\n❏ عدد نقاطك: 【 ${score} 】`;

  if (!AN || !QuestionOBJ[AN]) {
    return { message: Question };
  }

  if (QuestionOBJ[AN].ratio == 0) {
    data.delete(ID);
    cs[ID] = 0;
    return {
      message: `📍 جبت العيد:\n❏ ${QuestionOBJ[AN].result}.\n❏ عدد نقاطك:【 ${score} / 1500 】`,
      end: true
    };
  } else {
    data.set(ID, {
      score: score + QuestionOBJ[AN].ratio
    });

    cs[ID] = currentQs + 1;

    if (cs[ID] >= c.length) {
      
      data.delete(ID);
      cs[ID] = 0; 
      
    return {
        message: `📍 ${QuestionOBJ[AN].result}\n\n✓ لقد فزت 🥳\n❏ عدد نقاطك: 【 ${score + QuestionOBJ[AN].ratio} / 1500 】`,
        end: true
      };
    } else {
      currentQs = cs[ID];
      const NextQuestionOBJ = c[currentQs];
      const NextQuestion = `📍 ${QuestionOBJ[AN].result}\n\n☚ ${NextQuestionOBJ.QS}:\n\n1_❏ ${NextQuestionOBJ.A.action}\n2_❏ ${NextQuestionOBJ.B.action}\n3_❏ ${NextQuestionOBJ.C.action}\n\n❏ المرحلة: 【 ${currentQs + 1} 】\n❏ عدد نقاطك: 【 ${score + QuestionOBJ[AN].ratio} 】`;
      return { message: NextQuestion, end: false };
    }
  }
}
//🤡✓

/*
app.get('/ORD', async (req, res) => {
  const e = d[Math.floor(Math.random() * d.length)];
  const a = (word) => {
  const wordArray = word.split('');
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }
  const shuffledWord = wordArray.join(' ');
  return shuffledWord;
  }
  res.status(200).json({
    a: e,
    b: a(e)
  });
});
*/

 async function flags() {
  const f = x[Math.floor(Math.random() * x.length)];
  return {
    a: f.N,
    b: f.F
  }
}

async function QS() {
  const f = B[Math.floor(Math.random() * B.length)];
  return {
    a: f.Q,
    b: f.A
  }
}

module.exports = { QSR, QS, flags };