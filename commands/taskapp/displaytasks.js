const { SlashCommandBuilder, inlineCode } = require('discord.js');
const embedTemplates = require('../../assets/embedTemplates.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('displaytasks')
            .setDescription('Displays all the user\'s tasks (filtering coming soon)'),
            
    async execute(interaction) {
        // First check if the user exists in the database
        db.getUIDByDiscord(interaction.user.id)
            .then(async (userid) => { // Resolved, user exists!
                try {
                    // Connect to the PostgreSQL database and retrieve the user's tasks.
                    const db_client = await db.getClient();
                    const tasks_result = await db_client.query(
                        `SELECT * FROM tasks WHERE userid = ${userid};`
                    );
                    // Create and send the embed
                    interaction.channel.send({ embeds: [
                        embedTemplates.tasks_template(tasks_result, interaction.user.username)
                    ] });
                    await interaction.reply("Here are your tasks!");
                    db_client.release();
                } catch (err) {
                    console.log(`Error querying tasks: ${err}`);
                    await interaction.reply('An error occurred while trying to retrieve your tasks.');
                }
                

            }, async (error) => { // Rejected
                console.log(error);
                await interaction.reply(`You must create an account first! Use the ${inlineCode('/signup')} command to register.`);
            })
            .catch(async (err) => {
                console.log(`Error getting user ID: ${err.message}`);
                await interaction.reply('An error occurred while trying to get your user ID.');
            })
    }
}