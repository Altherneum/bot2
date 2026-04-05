const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

console.log("- Altherneum -\n");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

// Load events
client.commands = new Collection();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));


console.log("✅ Chargement des évents");
for (const file of eventFiles) {
    const event = require(`${eventsPath}/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
        console.log("    ✅ Chargement de l'évent unique " + event.name + " ; " + file);
    } else {
        client.on(event.name, (...args) => event.execute(...args));
        console.log("    ✅ Chargement de l'évent " + event.name + " ; " + file);
    }
}

client.login(config.token);