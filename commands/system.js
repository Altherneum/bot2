const { SlashCommandBuilder } = require('discord.js');
const { getSystemInfo } = require('../utils/systemMonitor');
const { createSystemEmbed } = require('../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('systeminfo')
        .setDescription('Show detailed system information of the bot server'),

    async execute(interaction) {
        try {
            const systemInfo = await getSystemInfo();
            const embed = createSystemEmbed(systemInfo);
            console.log(embed);
            console.log(systemInfo);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to execute /systeminfo:', error);
            await interaction.reply({
                content: '❌ Unable to retrieve system information.',
                ephemeral: true
            });
        }
    },
};