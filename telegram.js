const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const bot = new TelegramBot(config.token, {
//   polling: true,
});

// bot.on("message", (msg) => {
//   console.log(msg);
// });

module.exports = bot;
