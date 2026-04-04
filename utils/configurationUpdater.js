const fs = require('fs');

async function updateConfigFile(oldToNewChannelMap, configPath) {
    try {
        // Read config file
        const data = fs.readFileSync(configPath, 'utf8');
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
        }

        replaceId(config);

        // Save updated config
        fs.writeFileSync(configPath + "-updated", JSON.stringify(config, null, 2), 'utf8');
        console.log("✅ Configuration file updated:" +  configPath + "-updated");
    } catch (err) {
        console.error(`❌ Failed to update config:`, err.message);
    }
}


module.exports = { updateConfigFile };