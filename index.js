const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Load events
client.commands = new Collection();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`${eventsPath}/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(config.token);

const { getServer } = require('./utils/duplicateServer');
const guild = client.guilds.cache.get('1081921426333909072');
if (guild) {
    console.log(`Server Name: ${guild.name}`);
} else {
    console.log("Server not found in cache.");
}

client.guilds.cache.forEach(guild => {
    console.log(`ID: ${guild.id}, Name: ${guild.name}`);
});

const duped = getServer(guild);
console.log(duped);