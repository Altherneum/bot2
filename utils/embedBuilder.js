const { EmbedBuilder } = require('discord.js');

function createSystemEmbed(systemInfo) {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📊 System Information')
        .addFields(
            { name: 'CPU Load (Now)', value: systemInfo.LoadNow, inline: true },
            { name: 'CPU Load (15m)', value: systemInfo.LoadAvg, inline: true },
            { name: 'RAM Usage', value: systemInfo.ramUsage, inline: true },
            { name: 'Google Ping (fetch)', value: systemInfo.googlePing, inline: true },
            { name: 'GitHub Ping (fetch)', value: systemInfo.githubPing, inline: true },
            { name: 'Google Ping (CLI)', value: systemInfo.googlePing2, inline: true },
            { name: 'GitHub Ping (CLI)', value: systemInfo.githubPing2, inline: true },
            { name: 'Uptime', value: systemInfo.uptime, inline: false },
            { name: 'Total RAM', value: systemInfo.totalRam, inline: true },
            { name: 'Used RAM', value: systemInfo.usedRam, inline: true },
            { name: 'Free RAM', value: systemInfo.ramFree, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'System Monitoring' });
}

module.exports = { createSystemEmbed };