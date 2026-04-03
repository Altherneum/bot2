const { Client, GatewayIntentBits } = require('discord.js');

// Function to duplicate a server into JSON
async function getServer(server) {
    await server.channels.fetch(); //update cache

    return {
        name: server.name,
        ownerId: server.ownerId,
        channels: server.channels.cache.map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            permissions: Array.from(channel.permissionOverwrites.cache.values()).map(overwrite => ({
                id: overwrite.id,
                type: overwrite.type,
                allow: overwrite.allow.toArray(),
                deny: overwrite.deny.toArray()
            })),
            position: channel.position,
            topic: channel.topic,
            nsfw: channel.nsfw,
            parentId: channel.parentId,
            rateLimitPerUser: channel.rateLimitPerUser,
            availableTags: channel.availableTags,
            defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
            defaultForumLayout: channel.defaultForumLayout,
            defaultReactionEmoji: channel.defaultReactionEmoji,
            defaultTagSetting: channel.defaultTagSetting,
            defaultThreadRateLimitPerUser: channel.defaultThreadRateLimitPerUser,

        })),
        members: server.members, // Simplified
        roles: server.roles.cache.map(role => ({
            id: role.id,
            name: role.name,
            color: role.color,
            colorString: role.hexColor,
            mentionable: role.mentionable,
            position: role.position,
            hoist: role.hoist,
            permissions: role.permissions
        })),
    };
}

module.exports = { getServer };