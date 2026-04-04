const fs = require('fs');

const { createFile } = require('../utils/StoreFile');

async function updateConfigFile(oldToNewChannelMap, configPath, configToUpdate ,fileName) {
    try {
        // Read config file
        const data = fs.readFileSync(configPath + configToUpdate, 'utf8');
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

        const date = new Date().toISOString().slice(0, 19);
        const finalPath = configPath + "updated-" + date + fileName;
        const fileData = JSON.stringify(config, null, 2);
        createFile(fileName, fileData, configPath);

        console.log("✅ Configuration file updated:" +  finalPath);
    } catch (err) {
        console.error(`❌ Failed to update config:`, err.message);
    }
}


module.exports = { updateConfigFile };