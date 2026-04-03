const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildScheduledEvents
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


client.once('ready', () => {
    /*
    const { getServer } = require('./utils/duplicateServer');
    async function getServerData(){
        const guild = client.guilds.cache.get('1081921426333909072');
        if (guild) {
        console.log(`Server Name: ${guild.name}`);

            console.log(JSON.stringify(await getServer(guild), null, 2));

        } else {
            console.log("Server not found in cache.");
        }

        client.guilds.cache.forEach(guild => {
            console.log(`ID: ${guild.id}, Name: ${guild.name}`);
        });
    }
    getServerData()
    */


    const { populateServer } = require('./utils/uploadServer');
    const { getServer } = require('./utils/duplicateServer');
    const { clearServer } = require('./utils/deleteServer');

    async function test(){
        const guild = client.guilds.cache.get('1489696430758170646');
        const guildCloned = client.guilds.cache.get('1081921426333909072');

        if (guild && guildCloned) {
            console.log(`Server Name clear+populate: ${guild.name}`);
            await clearServer(guild);

            console.log(`Server Name to clone: ${guildCloned.name}`);
            const cloningData = await getServer(guildCloned);
            //console.log(cloningData);
            await populateServer(guild, cloningData);
        }
        else {
            console.log("Server not found in cache.");
        }

        client.guilds.cache.forEach(guild => {
            console.log(`ID: ${guild.id}, Name: ${guild.name}`);
        });
    }
    test();
});