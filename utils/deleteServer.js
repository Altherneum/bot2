const { Client } = require('discord.js');

async function clearServer(server) {
    // Delete all channels
    for (const channel of server.channels.cache.values()) {
        try {
            await channel.delete();
        } catch (err) {
            console.warn(`Could not delete channel ${channel.name}:`, err.message);
        }
    }

    // Delete all roles except @everyone
    for (const role of server.roles.cache.values()) {
        if (role.name === '@everyone') continue;
        try {
            await role.delete();
        } catch (err) {
            console.warn(`Could not delete role ${role.name}:`, err.message);
        }
    }

    console.log('Server cleared: all channels and roles removed.');
}

module.exports = { clearServer };