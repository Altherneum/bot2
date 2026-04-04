const fs = require('fs');

const { createFile } = require('../utils/StoreFile');
//"/bot2/configuration/",     guildCloned + "/voiceChannel.json",     guildPopulated + "/voiceChannel.json",      guildPopulated );
async function updateConfigFile(oldToNewChannelMap, configPath, configToUpdate ,configToSave, serverIdToSave) {
    try {
        let ScriptPath = process.cwd();
        // Read config file
        const data = fs.readFileSync(ScriptPath + configPath + configToUpdate, 'utf8');
        const config = JSON.parse(data);

        // Recursively replace old IDs with new ones
        function replaceId(obj) {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && oldToNewChannelMap.has(obj[key])) {
                    obj[key] = oldToNewChannelMap.get(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    replaceId(obj[key]);
                }
            }
        } replaceId(config);

        const finalPath = configPath + configToSave;
        createFile(configToSave, config, configPath + serverIdToSave);

        console.log("✅ Configuration file updated:" +  finalPath);
    } catch (err) {
        console.error(`❌ Failed to update config:`, err.message);
    }
}


module.exports = { updateConfigFile };