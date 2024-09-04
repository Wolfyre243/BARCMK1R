const { SlashCommandBuilder } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('signup')
            .setDescription('The command to create a new user account'),
            
    async execute(interaction) {
        const user_discordID = interaction.user.id;
        try {
            // Connect to the PostgreSQL database.
			const db_client = await db.getClient();

            // First check if the specified name already exists in the database.
            const userExists = await db_client.query(
                `SELECT EXISTS(SELECT 1 FROM discord_users WHERE discord_id='${user_discordID}')`
            );

            if (!userExists.rows[0].exists) { // If user does not exist
                
                const result = await db_client.query(
                    `INSERT INTO discord_users (userid, discord_id, username, date_created)
                    VALUES (nextval('user_id_sequence'), '${user_discordID}', '${interaction.user.username}', CURRENT_TIMESTAMP(2))
                    RETURNING *`
                )

                // Reply with the added rows
                await interaction.reply(`Welcome ${result.rows[0].username}!`);
                db_client.release();

            } else { // If user already exists
                await interaction.reply(`You are already an existing user!`);
                db_client.release();
            }
            
		} catch (err) {
			console.log(`Error inserting rows: ${err.message}`);
		}
    }
}