console.log(`\x1b[93m────────── SCRIPT ───────────────\x1b[0m`);

log.info("Loading scripts ...");

const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const fs = require("fs");
const { execSync } = require('child_process');

module.exports = async (VexaBot, FCA) => {

  const errorMessages = [];

  // Commands
  const commandsPath = VexaBot.cmdsPath;
  const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('.eg'));

  let loadedCommandsCount = 0;

  for (const command of listCommand) {
    try {
      const module = require(`${commandsPath}/${command}`);
      const { config, atEvent, onLoad } = module;

      const code = readFileSync(`${commandsPath}/${command}`, 'utf-8');

      if (!config?.name) {
        throw new Error(`Do not have a name`);
      }

      if (!config?.category) {
        throw new Error(`Do not have category.`);
      }

      if (VexaBot.commands.has(config.name || '')) {
        log.err(`${command} have a name of another command change his name`);
        continue;
      }

      if (config.aliases) {
        let { aliases } = config;
        if (typeof aliases == "string") {
          aliases = [aliases];
        }
        for (const aliasesYuki of aliases) {
          if (typeof aliasesYuki === "string") {
            if (VexaBot.aliases.has(aliasesYuki)) {
              log.err(`Short Name ${aliasesYuki} already exists in another command: ${VexaBot.aliases.get(aliasesYuki)}`);
              continue;
            } else {
              VexaBot.aliases.set(aliasesYuki, config.name);
            }
          }
        }
      }

      if (atEvent) {
        VexaBot.atEvent.set(config.name, module);
      }

      if (onLoad) {
        const moduleData = {
          api: FCA
        };
        module.onLoad(moduleData);
      }

      if (module.atChat) VexaBot.atChat.push(config.name.toLowerCase());
      VexaBot.commands.set(config.name.toLowerCase(), module);
      loadedCommandsCount++;

    } catch (error) {
      errorMessages.push({ command: `Error at ${command} command:\n${error.stack}` });
    }
  }

  // Events
  const eventsPath = VexaBot.eventsPath;
  const events = readdirSync(eventsPath).filter(ev => ev.endsWith('.js'));

  let loadedEventsCount = 0;

  for (const ev of events) {
    try {
      const event = require(`${eventsPath}/${ev}`);
      const { config, onLoad, onRun } = event;

      if (!config || !config.name || !onRun) {
        log.err(`Event ${ev} is not in the correct format. `);
        continue;
      }

      if (VexaBot.events.has(config.name)) {
        log.err(`${config.name} Event have another event name so change his name`);
        continue;
      }

      if (onLoad) {
        const eventData = {
          api: FCA
        };
        await onLoad(eventData);
      }
      VexaBot.events.set(config.name.toLowerCase(), event);
      loadedEventsCount++;
      } catch (err) {
      errorMessages.push({ command: `Error at ${ev} event:\n${err.stack}` });
    }
  }

  log.info('CMDS', `Total commands ${loadedCommandsCount}`);
  log.info('EVENTS', `Total events ${loadedEventsCount}`);

  if (errorMessages.length > 0) {
    errorMessages.forEach(({ command }) => {
      log.err('LoaderErrors', command);
    });
  }
};
