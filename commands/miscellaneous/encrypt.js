const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('encrypt') // /encrypt
            .setDescription('Encrypts your text in base64')
            // Set a string option (aka parameter) for the command.
            .addStringOption(option => 
                option.setName('text') // Name of the option
                    .setDescription('The text to encrypt')
                    .setRequired(true)
            ),

    async execute(interaction) {
        // Retreive the command's 'text' argument
        const text = interaction.options.getString('text');
        // btoa encodes the text in base64
        await interaction.reply(`Here's your text: ${btoa(text)}`);
    }
}