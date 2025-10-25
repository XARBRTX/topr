const createFuncMessage = global.utils.message;

const handlerCheckDB = require("./actions/handlerCheckDB.js");


module.exports = function({ api, threadModel, userModel, globalModel, threadsData, usersData, globalData }) {
  
	const handleEvents = require('./actions/handlerEvents.js')(api, threadModel, userModel, globalModel, threadsData, usersData, globalData);
  
	const handleBot = require('./actions/fastRun.js')(api, threadsData, usersData, globalData);
	return async function (event) {
    
    const message = createFuncMessage(api, event);

    await handlerCheckDB(usersData, threadsData, event);
    
    await handleBot(event, message);
    
    const handleChatActions = await handleEvents(event, message);
    
    if (!handleChatActions) return;
  
    const { onAnyEvent, atChat, atCall, onEvent, atReply, atReact, atEvent, addReact } = handleChatActions;
   

    onAnyEvent();
   	switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
        atCall();
        atChat();
        atReply();
        require("./onListen.js")({ api, threadModel, userModel, globalModel, threadsData, usersData, globalData, message, event });
				break;
			case "change_thread_image": 
				break;
			case "event":    
				onEvent();
        atEvent();
        require("./onListen.js")({ api, threadModel, userModel, globalModel, threadsData, usersData, globalData, message, event });
				break;
			case "message_reaction":
				atReact();
        addReact();
        require("./onListen.js")({ api, threadModel, userModel, globalModel, threadsData, usersData, globalData, message, event });
        break;
      case "typ":
        {
          //Your code 
        }
				break;
			case "presence":
        {
          //Your code 
        }
				break;
			case "read_receipt":
        {
          //Your code 
        }
				break;
			  default:
				break;
		}
	};
};
