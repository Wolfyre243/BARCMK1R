const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('clearspam') // /encrypt
            .setDescription('Clears the oldest spam nuke')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Admin is needed for this command.

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply("You do not have permission to run this command.");
        } else {
            try {
                if (interaction.client.spamCache[0]) {
                    clearInterval(interaction.client.spamCache[0].intervalId);
                    let removedInterval = interaction.client.spamCache.shift();
                    await interaction.reply(`Cleared spam with queue ID: ${removedInterval.queueId}`);
                } else {
                    await interaction.reply("No spams in queue to clear.");
                }
            } catch (err) {
                console.error(err);
                await interaction.reply("Error while clearing spam.");
            }
        }
    }
}