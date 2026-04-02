# bot2
Bot using Discord.js
## Installation
```bash
npm init -y
npm install discord.js
```
## How to Use the Bot

- Create a new Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
- Add your bot token to config.json
- Invite the bot to your server with the necessary permissions (Ban Members, Send Messages, etc.)
- Run the bot with `node index.js`
## Commands
- `/ban <user> [reason]` - Ban a user and send them a DM
- `/unban <user> [reason]` - Unban a user and send them a DM
- `/system` - Show system information in an embed