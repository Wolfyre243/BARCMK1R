const { SlashCommandBuilder } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('query') // /query
            .setDescription('A command to test querying a database using a discord bot.'),

    async execute(interaction) {
        try {
            // Connect to the PostgreSQL database.
			const db_client = await db.getClient();

            //Perform the query
            const result = await db.query(`SELECT * FROM users`);
            // Print out the results
            for await (const row of result.rows) {
                await interaction.channel.send(`${row.id}. ${row.name} Age: ${row.age}`);
            }
            // wait for the loop to complete first.
            
            await interaction.reply("Query successful");
            db_client.release();
            
            
		} catch (err) {
			console.log(err);
		}
    }
}