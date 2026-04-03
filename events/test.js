const { Events } = require('discord.js');
const { populateServer } = require('../utils/uploadServer');
const { getServer } = require('../utils/duplicateServer');
const { clearServer } = require('../utils/deleteServer');
const { createFile } = require('../utils/StoreFile');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log("🪧 Chargement des tests !");

        async function test(){
            const guild = client.guilds.cache.get('1489696430758170646');
            const guildCloned = client.guilds.cache.get('1081921426333909072');

            if (guild && guildCloned) {
                console.log(`🧹 Server Name clear: ${guild.name}`);
                await clearServer(guild);

                console.log(`📂 Server Name to clone: ${guildCloned.name}`);
                const cloningData = await getServer(guildCloned);
                createFile("testStorage.json", cloningData, "./");

                //console.log(`🧑‍🤝‍🧑 Server Name populate: ${guild.name}`);
                //await populateServer(guild, cloningData);
            }
            else {
                console.log("⚠️ Server not found in cache.");
            }
        }

        test();
        console.log("🪧 Fin des tests !");
    },
};