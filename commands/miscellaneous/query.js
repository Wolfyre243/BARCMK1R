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
                LIMIT 5
            `)

            for (let i = 0; i < 5; i++) {
                interaction.channel.send(`${i}. ${result.rows[i].first_name}`);
            }
            // wait for the loop to complete first.
            await interaction.reply("Query successful");

		} catch (err) {
			console.log(err);
		}
    }
}