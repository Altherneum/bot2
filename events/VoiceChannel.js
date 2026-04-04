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
        const { channel: oldChannel } = oldState;
        const { channel: newChannel, guild, member } = newState;

        // 1. User joins the "Join to Create" channel
        if (newChannel && newChannel.id === triggerChannel) {
            console.log("🆕 Nouvelle tentative de création d'un salon vocal par " + member.user.tag);

            try {
                const channel = await guild.channels.create({
                    name: member.user.tag,
                    type: 2, // 'GUILD_VOICE'
                    parent: mainCategory,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [PermissionFlagsBits.ManageChannels]
                        }
                    ]
                });
                console.log("  ☑️ Salon vocal crée pour " + member.user.tag);

                await member.voice.setChannel(channel);
                temporaryChannels.add(channel.id);
                console.log("  🎤 Déplacement dans le salon vocal de " + member.user.tag);
            } catch (error) {
                console.error("  ⚠️ Erreur lors de la création du salon vocal : " + error);
            }

            return; // Prevent further processing in this tick
        }

        // 2. Channel cleanup: Delete if empty and was temporary
        if (
            oldChannel &&
            oldChannel.members.size === 0 &&
            temporaryChannels.has(oldChannel.id) &&
            (!newChannel || newChannel.id !== oldChannel.id)
        ) {
            try {
                await oldChannel.delete();
                temporaryChannels.delete(oldChannel.id);
                console.log("☑️ Salon vocal supprimé par " + member.user.tag);
            } catch (error) {
                console.log("⚠️ Erreur lors de la suppression du salon vocal par " + member.user.tag + " ; " + erreur);
            }
        }
    }
};