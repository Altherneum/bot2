const { EmbedBuilder } = require('discord.js');

function createEmbed(message, footer, footerURL) {
    return new EmbedBuilder()
    .setColor("#FFFF00")
    .setTitle('📊 System Information')
    .setDescription(message)
    .setTimestamp()
    .setFooter({ 
        text: footer,
        iconURL: footerURL,
    });
}

module.exports = { createEmbed };


