const { SlashCommandBuilder } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('insert') // /query
            .setDescription('A command to test insertion for PostgreSQL.')
            .addStringOption(option => 
                option.setName('name')
                    .setDescription('The name of the person to insert')
                    .setRequired(true)
            )
            .addNumberOption(option => 
                option.setName('age')
                    .setDescription('The age of the person to insert')
                    .setRequired(true)
            ),
            
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const age = interaction.options.getNumber('age');
        try {
            // Connect to the PostgreSQL database.
			const db_client = await db.getClient();

            // First check if the specified name already exists in the database.
            const userExists = await db_client.query(
                `SELECT EXISTS(SELECT 1 FROM users WHERE name='${name}')`
            );

            if (!userExists.rows[0].exists) { // If user does not exist
                const result = await db_client.query(
                    `INSERT INTO users (id, name, age)
                    VALUES (nextval('toserial'), '${name}', ${age})
                    RETURNING *`
                )

                // Reply with the added rows
                await interaction.reply(`Added rows:\n${result.rows[0].id}. ${result.rows[0].name} Age: ${result.rows[0].age}`);
                db_client.release();
            } else { // If user already exists
                await interaction.reply(`User with name '${name}' already exists.`);
                db_client.release();
            }
            
		} catch (err) {
			console.log(`Error inserting rows: ${err.message}`);
		}
    }
}