# AEK FC News Ticket Announcement Notifier

This project uses Puppeteer to scrape the AEK FC news page and checks for new ticket announcements. If a new ticket announcement is found, a Telegram message is sent to notify the user.

## Features
- Scrapes the AEK FC news page for new ticket announcements.
- Sends a Telegram message when a new ticket announcement is found.
- Runs periodically at a configurable interval.

## Configuration
Create a Telegram Bot:

.1 Open Telegram and search for the "BotFather".

Start a chat with BotFather and use the /newbot command to create a new bot.

Follow the instructions to name your bot and get your bot's token.

Get Your Chat ID:

Start a chat with your bot and send any message.

Visit https://api.telegram.org/bot<YourBOTToken>/getUpdates to find your chat ID in the JSON response.

Update Configuration:

Replace the bot token and chat ID in the telegram.js file.

Update the config.js file with your desired settings.