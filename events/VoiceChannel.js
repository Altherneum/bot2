const { Events, PermissionFlagsBits } = require('discord.js');
const configGlobal = require('../config.json');
const serverID = configGlobal.guildId;
const config = require("../configuration/" + serverID + "/voiceChannel.json");

const mainCategory = config.voiceChannelDestinationCategory; // Replace with your Category ID
const triggerChannel = config.voiceChannelTrigger; // Replace with the "Join to Create" Channel ID
const temporaryChannels = new Set();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const { channelID: oldChannelId, channel: oldChannel } = oldState;
        const { channelID: newChannelId, guild, member } = newState;

        if (newChannelId === triggerChannel) {
            try {
                const channel = await guild.channels.create(
                    `${member.user.username}'s channel`,
                    { 
                        type: 'GUILD_VOICE', // Use 'GUILD_VOICE' for v14+
                        parent: mainCategory,
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: [PermissionFlagsBits.ManageChannels] // Correct flag name
                            }
                        ]
                    }
                );
                
                await newState.setChannel(channel);
                temporaryChannels.add(channel.id);
            }
            catch (error) {
                console.error('Error creating channel:', error);
            }
        }
    }
}

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const { channelID: oldChannelId, channel: oldChannel } = oldState;
        const { channelID: newChannelId } = newState;

        // Delete channel if it becomes empty
        if (
            oldChannel && 
            oldChannel.members.size === 0 && 
            temporaryChannels.has(oldChannelId) && 
            oldChannelId !== newChannelId
        ) {
            try {
                await oldChannel.delete();
                temporaryChannels.delete(oldChannelId);
            }
            catch (error) {
                console.error('Error deleting channel:', error);
            }
        }
    }
}