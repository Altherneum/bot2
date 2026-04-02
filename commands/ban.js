const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Send DM to the user
            await user.send(`You have been banned from ${interaction.guild.name} for: ${reason}`);

            // Ban the user
            await interaction.guild.members.ban(user, { reason });

            await interaction.reply(`✅ Successfully banned ${user.tag} for: ${reason}`);
        } catch (error) {
            console.error(error);
            if (error.code === 50007) {
                await interaction.reply(`⚠️ Could not send DM to ${user.tag}. They may have DMs disabled.`);
            }
            await interaction.guild.members.ban(user, { reason });
            await interaction.reply(`✅ Successfully banned ${user.tag} for: ${reason}`);
        }
    },
};