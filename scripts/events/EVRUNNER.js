const allOnEvent = global.VexaBot.Event;

module.exports = {
  config: {
    name: "atEvent",
    version: "1.1",
    author: "Allou Mohamed",
    description: "Loop to all event in global.VexaBot.Event and run when have new event",
    category: "events"
  },

  onRun: async ({ api, args, message, event, threadsData, usersData, role}) => {
    for (const item of allOnEvent) {
      if (typeof item === "string")
        continue;
      item.run({ api, args, message, event, threadsData, usersData, role, commandName });
    }
  }
};