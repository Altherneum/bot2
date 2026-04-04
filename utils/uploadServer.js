const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

function getChannelTypeString(type) {
    switch (type) {
        case 0: return 'GUILD_TEXT';
        case 2: return 'GUILD_VOICE';
        case 4: return 'GUILD_CATEGORY';
        case 5: return 'GUILD_ANNOUNCEMENT';
        case 13: return 'GUILD_STAGE_VOICE';
        case 15: return 'GUILD_FORUM';
        default: return null;
    }
}

async function populateServer(server, template) {
    console.log("Start populate : " + server.name);
    // === Step 1: Create Roles ===
    const roleMap = new Map(); // To map old role IDs to new ones

    // Sort roles by position so hierarchy is preserved
    const sortedRoles = template.roles.sort((a, b) => b.position - a.position);

    for (const roleData of sortedRoles) {
        try {
            console.log("🕰 Création du rôle : " + roleData.name);
            const newRole = await server.roles.create({
                name: roleData.name,
                color: roleData.color,
                permissions: roleData.permissions,
                mentionable: roleData.mentionable,
                hoist: roleData.hoist,
                reason: 'Restored from backup',
            });
            roleMap.set(roleData.id, newRole.id);
            console.log("📗 Rôle crée : " + roleData.name);
        } catch (err) {
            console.warn(`⚠️ Could not create role ${roleData.name}:`, err.message);
        }
    }

    // Add @everyone role mapping
    roleMap.set(server.id, server.roles.everyone.id);

    // === Step 2: Create Categories First (since channels depend on them) ===
    const categoryMap = new Map(); // old ID → new Category channel

    const categories = template.channels.filter(ch => ch.type === 'GUILD_CATEGORY');
    for (const catData of categories) {
        try {
            console.log("🕰 Création de la catégorie : " + catData.name);
            const parent = await server.channels.create({
                name: catData.name,
                type: ChannelType.GuildCategory,
                permissionOverwrites: catData.permissions?.map(perm => ({
                    id: roleMap.get(perm.id) || perm.id,
                    type: perm.type,
                    allow: perm.allow.length > 0 ? perm.allow : null,
                    deny: perm.deny.length > 0 ? perm.deny : null,
                })) || [],
                reason: 'Restored from backup',
            });
            console.log("📗 Catégorie crée : " + catData.name);
            categoryMap.set(catData.id, parent);
        } catch (err) {
            console.warn(`⚠️ Could not create category ${catData.name}:`, err.message);
        }
    }

    // === Step 3: Create Other Channels (Text, Voice, Forum, etc.) ===
    const otherChannels = template.channels.filter(ch => ch.type !== 'GUILD_CATEGORY');

    for (const chData of otherChannels) {
        try {
            const parent = categoryMap.get(chData.parentId) || null;

            const channelPermissions = chData.permissions?.map(perm => ({
                id: roleMap.get(perm.id) || perm.id,
                type: perm.type,
                allow: perm.allow.length > 0 ? perm.allow : null,
                deny: perm.deny.length > 0 ? perm.deny : null,
            })) || undefined;

            let channelOptions = {
                name: chData.name,
                type: getChannelTypeString(chData.type),
                topic: chData.topic,
                nsfw: chData.nsfw,
                rateLimitPerUser: chData.rateLimitPerUser,
                parent: parent,
                permissionOverwrites: channelPermissions,
                position: chData.position,
                reason: 'Restored from backup',
            };

            // Add forum-specific fields if applicable
            if (getChannelTypeString(chData.type) === 'GUILD_FORUM') {
                channelOptions.availableTags = chData.availableTags || [];
                channelOptions.defaultAutoArchiveDuration = chData.defaultAutoArchiveDuration;
                channelOptions.defaultForumLayout = chData.defaultForumLayout;
                channelOptions.defaultReactionEmoji = chData.defaultReactionEmoji;
                channelOptions.defaultThreadRateLimitPerUser = chData.defaultThreadRateLimitPerUser;
            }

            await server.channels.create(channelOptions);
            console.log("🕰 Création du salon : " + chData.name + " ; " + getChannelTypeString(chData.type));
        } catch (err) {
            console.warn(`⚠️ Could not create channel ${chData.name}:`, err.message);
        }
    }

    console.log('Server populated successfully!');
    return { roleMap, categoryMap };
}

module.exports = { populateServer };