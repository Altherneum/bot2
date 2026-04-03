const { Events } = require('discord.js');
const mainCategory = 'CATEGORY_ID'; // Replace with your Category ID
const triggerChannel = 'TRIGGER_CHANNEL_ID'; // Replace with the "Join to Create" Channel ID
const temporaryChannels = new Set();


bot.on('voiceStateUpdate', async (oldState, newState) => {
    const { channelID: oldChannelId, channel: oldChannel } = oldState;
    const { channelID: newChannelId, guild, member } = newState;

    // 1. Create new channel when user joins the trigger channel
    if (newChannelId === triggerChannel) {
        try {
            const channel = await guild.channels.create(
                `${member.user.username}'s channel`,
                { 
                    type: 'voice', 
                    parent: mainCategory,
                    permissionOverwrites: [
                        {
                            id: member.id, // Target the user who joined
                            allow: ['MANAGE_CHANNELS'] // Grant manage channel permission
                        }
                        // Optionally, you can also deny permissions for @everyone here
                    ]
                }
            );
            // Move the user to the newly created channel
            await newState.setChannel(channel);
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    }
});

bot.on('voiceStateUpdate', async (oldState, newState) => {
    const { channelID: oldChannelId, channel: oldChannel } = oldState;
    const { channelID: newChannelId, guild, member } = newState;


    // 2. Delete channel if it becomes empty
    if (
        oldChannel && 
        oldChannel.members.size === 0 && // Channel is empty
        temporaryChannels.has(oldChannelId) && // Was a temporary channel
        oldChannelId !== newChannelId // User left the channel
    ) {
        try {
            await oldChannel.delete();
            temporaryChannels.delete(oldChannelId);
        } catch (error) {
            console.error('Error deleting channel:', error);
        }
    }
});