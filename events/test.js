const { Events } = require('discord.js');
const { populateServer } = require('../utils/uploadServer');
const { getServer } = require('../utils/duplicateServer');
const { clearServer } = require('../utils/deleteServer');
const { createFile } = require('../utils/StoreFile');
const { updateConfigFile } = require('../utils/configurationUpdater');

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
                createFile("backup.json", cloningData, "/bot2/configuration/" + guildCloned + "/");

                console.log(`🧑‍🤝‍🧑 Server Name populate: ${guildPopulated.name}`);
                const data = await populateServer(guildPopulated, cloningData);
                
                /*
                WIP
                */
                //
                console.log("⏰ Mise à jour de la configuration en cours ...");
                const channelMap = data.channelMap;
                await updateConfigFile(channelMap, "/bot2/configuration/", guildCloned + "/voiceChannel.json", guildPopulated + "/voiceChannel.json");
                console.log("📚 Fin de la mise à jour de la configuration !");
            }
            else {
                console.log("⚠️ Server not found in cache.");
            }
        }

        test();
        console.log("🪧 Fin des tests !");
    },
};