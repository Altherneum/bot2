# bot2
Bot using Discord.js
## Installation
```bash
git clone https://github.com/Altherneum/bot2
NEW_TOKEN=ABCD_BOT_TOKEN
sed -i 's/YOUR_BOT_TOKEN_HERE/'$NEW_TOKEN'/g' bot2/config.json

npm init -y
npm install discord.js

node bot2/index.js
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