const { SlashCommandBuilder } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('query-age') // /query-age
            .setDescription('A command to retrieve all users with the specified age.')
            .addNumberOption(option => 
                option.setName('age') // Name of the option
                    .setDescription('The age to search')
                    .setRequired(true)
            ),

    async execute(interaction) {
        const age = interaction.options.getNumber('age');

        try {
            // Connect to the PostgreSQL database.
			const db_client = await db.getClient();

            // Perform the query
            const result = await db_client.query(`SELECT * FROM users WHERE age=${age}`);

            // Check if the query returned any rows
            if (result.rows.length > 0) {
                // Print out the results
                await interaction.channel.send(`Users with age ${age}:`);
                for await (const row of result.rows) {
                    await interaction.channel.send(`${row.id}. ${row.name} Age: ${row.age}`);
                }
            } else {
                await interaction.channel.send(`No users found with age ${age}`);
            }
            // Wait for the loop to complete first.
            await interaction.reply("Query successful");
            db_client.release();
            
		} catch (err) {
			console.log(err);
		}
    }
}