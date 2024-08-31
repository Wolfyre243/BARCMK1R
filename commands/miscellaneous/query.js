const { SlashCommandBuilder } = require('discord.js');
const { db_client } = require('../../databasing/database-client.js')

module.exports = {
    data: new SlashCommandBuilder()
            .setName('query') // /query
            .setDescription('A command to test querying a database using a discord bot.'),

    async execute(interaction) {
        db_client.query(`
            SELECT * 
            FROM actor
            LIMIT 3
            `, async (err, result) => {
                if (!err) {
                    await interaction.reply(`First 3 query results: \n ${result.rows}`);
                } else {
                    await interaction.reply("An error occurred during the query.")
                    console.log(err);
                }
            }
        )
    }
}