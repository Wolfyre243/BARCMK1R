const { SlashCommandBuilder } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('insert') // /query
            .setDescription('A command to test insertion for PostgreSQL.'),
            // Add parameters here
    async execute(interaction) {
        try {
            // Connect to the PostgreSQL database.
			const db_client = await db.getClient();

            //Perform the query
            const result = await db_client.query(
                `INSERT INTO users(id, name, age) VALUES($1, $2, $3) RETURNING *`,
                [3, 'Hippo', 32]
            );
            
            // wait for the loop to complete first.
            await interaction.reply(`Added rows:\n${result.rows[0].id}. ${result.rows[0].name} Age: ${result.rows[0].age}`);
            db_client.release();
            
		} catch (err) {
			console.log(`Error inserting rows: ${err.message}`);
		}
    }
}