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

    // Delete all roles except @everyone and non-editable roles (including bot's own role)
    for (const role of server.roles.cache.values()) {
        if (role.name === '@everyone') continue;
        if (!role.editable) {
            console.warn(`Skipping role ${role.name} (not editable - likely bot or higher role)`);
            continue;
        }
        try {
            await role.delete();
        } catch (err) {
            console.warn(`Could not delete role ${role.name}:`, err.message);
        }
    }

    console.log('Server cleared: all deletable channels and roles removed.');
}

module.exports = { clearServer };