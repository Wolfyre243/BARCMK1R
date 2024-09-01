const { SlashCommandBuilder } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('query') // /query
            .setDescription('A command to test querying a database using a discord bot.'),

    async execute(interaction) {
        try {
            // Connect to the PostgreSQL database.
			await db.pool.connect().then(async () => {
                console.log('Connected to PostgreSQL.\nDatabase: test-db');
            });

            //Perform the query
            const result = await db.query(`
                SELECT * 
                FROM actor
                LIMIT 3
            `)

            await interaction.reply(`First result:\n${result.rows[0].first_name}`);

		} catch (err) {
			console.log(err);
		}
    }
}