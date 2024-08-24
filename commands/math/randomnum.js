const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('randomnum') // /randomnum
            .setDescription('Replies with a random number between 1 to 100'),

    async execute(interaction) {
        let num = Math.floor(Math.random() * 100) + 1;
        await interaction.reply(num.toString());
    }
}