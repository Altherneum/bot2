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
            const guildCloned = client.guilds.cache.get('1489696430758170646');
            const guildPopulated = client.guilds.cache.get('1489988288365461554');

            if (guildPopulated && guildCloned) {
                console.log(`🧹 Server Name clear: ${guildPopulated.name}`);
                await clearServer(guildPopulated);

                console.log(`📂 Server Name to clone: ${guildCloned.name}`);
                const cloningData = await getServer(guildCloned);
                createFile("testStorage.json", cloningData, "/bot2/configuration/");

                console.log(`🧑‍🤝‍🧑 Server Name populate: ${guildPopulated.name}`);
                await populateServer(guildPopulated, cloningData);
            }
            else {
                console.log("⚠️ Server not found in cache.");
            }
        }

        test();
        console.log("🪧 Fin des tests !");
    },
};