module.exports = async ({ api, threadModel, userModel, globalModel, threadsData, usersData, globalData, event, message }) => {
      if (global.VexaBot.onListen.size == 0) return;

      try {
        global.VexaBot.onListen.forEach(async (current, KEY) => {
          try {
            const conditionResult = eval(current.condition);
            if (conditionResult) {
              const resultFunction = eval(current.result);
              if (typeof resultFunction === 'function') {
                await resultFunction();
              }
              global.VexaBot.onListen.delete(KEY);
            }
          } catch (err) {
            console.error(err);
          }
        });
      } catch (err) {
        console.error(err);
      }
  }