# bot2
Bot using Discord.js
## Installation
```bash
# Clone repo
git clone https://github.com/Altherneum/bot2

# Set bot token
NEW_TOKEN=ABCD_BOT_TOKEN
CLIENT_ID=ABCD_BOT_ID
GUILD_ID=00000

# Apply bot token
sed -i 's/YOUR_BOT_TOKEN_HERE/'$NEW_TOKEN'/g' bot2/config.json
sed -i 's/YOUR_CLIENT_ID_HERE/'$CLIENT_ID'/g' bot2/config.json
sed -i 's/YOUR_GUILD_ID_HERE/'$GUILD_ID'/g' bot2/config.json

# Get discord NPM package
npm init -y
npm install discord.js@14.26.0 # npm install discord.js

# start nodeJS
node bot2/index.js
```
## Update
```
cp bot2/config.json config.json;

rm -rf bot2/

git clone https://github.com/Altherneum/bot2

cp config.json bot2/config.json
rm config.json

# start nodeJS
node bot2/index.js
```
## How to Use the Bot
- Create a new Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
- Add your bot token to config.json
- Invite the bot to your server with the necessary permissions (Ban Members, Send Messages, etc.)
- Drop the configuration file under `/configuration/GUILD_ID/*.json`
- Run the bot with `node index.js`
## Commands
- `/ban <user> [reason]` - Ban a user and send them a DM
- `/unban <user> [reason]` - Unban a user and send them a DM
- `/system` - Show system information in an embed