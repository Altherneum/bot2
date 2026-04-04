const { Events } = require('discord.js');
let doTest = false;

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
            const guildCloned = client.guilds.cache.get('1081921426333909072');
            const guildPopulated = client.guilds.cache.get('1489988288365461554');

            if (guildPopulated && guildCloned && doTest) {
                console.log(`🧹 Server Name clear: ${guildPopulated.name}`);
                await clearServer(guildPopulated);

                console.log(`📂 Server Name to clone: ${guildCloned.name}`);
                const cloningData = await getServer(guildCloned);
                createFile("backup.json", cloningData, "/bot2/configuration/" + guildCloned + "/");

                console.log(`🧑‍🤝‍🧑 Server Name populate: ${guildPopulated.name}`);
                const data = await populateServer(guildPopulated, cloningData);
                
                console.log("⏰ Mise à jour de la configuration en cours ...");
                const channelMap = data.channelMap;
                await updateConfigFile(channelMap, "/bot2/configuration/", guildCloned + "/voiceChannel.json", "/voiceChannel.json", guildPopulated );
                console.log("📚 Fin de la mise à jour de la configuration !");
                
                /*
                WIP
                - Make load from Json
                - When server is done duplicating ;
                - - "rulesChannelId": "1081932471408529490",
                - - "safetyAlertsChannelId": "1081947188722155601",
                - - "publicUpdatesChannelId": "1081932471408529492",
                - - "verificationLevel": 1,
                - - "explicitContentFilter": 2,
                - - "systemChannelId": "1081941784252403742",
                - - "defaultMessageNotifications": 1,
                - - "afkTimeout": 300,
                - - "features": [
                    "AUTO_MODERATION",
                    "PREVIEW_ENABLED",
                    "GUILD_ONBOARDING",
                    "AUTOMOD_TRIGGER_USER_PROFILE",
                    "COMMUNITY",
                    "GUILD_SERVER_GUIDE",
                    "SOUNDBOARD",
                    "WELCOME_SCREEN_ENABLED",
                    "NEWS",
                    "MEMBER_VERIFICATION_GATE_ENABLED",
                    "GUILD_ONBOARDING_EVER_ENABLED",
                    "GUILD_ONBOARDING_HAS_PROMPTS",
                    "MEMBER_VERIFICATION_MANUAL_APPROVAL",
                    "GUESTS_ENABLED",
                    "CHANNEL_ICON_EMOJIS_GENERATED"
                ],
                - - "afkChannelId": "1081943448514482246",
                - - "preferredLocale": "fr",
                */
                //
            }
            else {
                console.log("⚠️ Server not found in cache.");
            }
        }

        test();
        console.log("🪧 Fin des tests !");
    },
};