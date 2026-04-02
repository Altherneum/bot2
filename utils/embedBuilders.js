const { EmbedBuilder } = require('discord.js');

function createSystemEmbed(systemInfo) {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📊 System Information')
        .addFields(
            { name: 'CPU Usage', value: systemInfo.cpuUsage, inline: true },
            { name: 'RAM Usage', value: systemInfo.ramUsage, inline: true },
            { name: 'Google Ping', value: systemInfo.googlePing, inline: true },
            { name: 'GitHub Ping', value: systemInfo.githubPing, inline: true },
            { name: 'Uptime', value: systemInfo.uptime, inline: false },
            { name: 'Total RAM', value: systemInfo.totalRam, inline: true },
            { name: 'Used RAM', value: systemInfo.usedRam, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'System Monitoring' });
}

module.exports = { createSystemEmbed };