const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unbanning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Send DM to the user
            await user.send(`You have been unbanned from ${interaction.guild.name}. Reason: ${reason}`);

            // Unban the user
            await interaction.guild.bans.remove(user, reason);

            await interaction.reply(`✅ Successfully unbanned ${user.tag}`);
        } catch (error) {
            console.error(error);
            if (error.code === 50007) {
                await interaction.reply(`⚠️ Could not send DM to ${user.tag}. They may have DMs disabled.`);
            }
            await interaction.guild.bans.remove(user, reason);
            await interaction.reply(`✅ Successfully unbanned ${user.tag}`);
        }
    },
};