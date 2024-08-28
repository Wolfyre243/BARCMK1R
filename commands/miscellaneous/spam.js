const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('spam') // /encrypt
            .setDescription('Spams text of your choice in a specific channel')
            // Set a string option (aka parameter) for the command.
            .addIntegerOption(option => 
                option.setName('interval') // Name of the option
                    .setDescription('The interval at which to spam, in milliseconds')
                    .setRequired(true)
            )
            .addChannelOption(option => 
                option.setName('channel')
                    .setDescription('The channel to spam in')
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName('text') // Name of the option
                    .setDescription('The text to spam')
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Admin is needed for this command.

    async execute(interaction) {
        // Retreive the command's 'interval' argument
        const interval = await interaction.options.getInteger('interval');
        const channel = await interaction.options.getChannel('channel');
        const text = await interaction.options.getString('text');

        // Check if interval is valid
        if (interval < 1000) {
            await interaction.reply("Spam interval too short. It won't work.");
        } else {
            // Alert and start spamming
            try {
                let intervalId = () => {
                    let spamInterval = {
                        queueId: interaction.client.spamCache.length + 1,
                        intervalId: setInterval(() => {
                            channel.send(text);
                        }, interval)
                    }
                    return spamInterval;
                }
                interaction.client.spamCache.push(intervalId());
            } catch (err) {
                console.error(err);
                await interaction.reply("Could not push interval ID into cache.");
            }
        }
    }
}