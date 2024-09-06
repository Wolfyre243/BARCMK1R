const { SlashCommandBuilder, inlineCode } = require('discord.js');
const embedTemplates = require('../../assets/embedTemplates.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('completetask')
            .setDescription('Completes a task based on its ID')
            .addNumberOption(option => 
                option.setName('task-id') // Name of the option
                    .setDescription('The ID of the task to complete')
                    .setRequired(true)
            ),
            
    async execute(interaction) {
        // Obtain ID of task to mark as completed
        const taskid = interaction.options.getNumber('task-id')
        // First check if the user exists in the database
        db.getUIDByDiscord(interaction.user.id)
            .then(async (userid) => { // Resolved, user exists!
                try {
                    // Connect to the PostgreSQL database and update the task
                    // TODO: Add validation; if task is already complete, do not execute the query.
                    const db_client = await db.getClient();
                    const tasks_result = await db_client.query(
                        `UPDATE tasks
                        SET completed = true
                        WHERE userid = ${userid} AND taskid = ${taskid}
                        RETURNING *;`
                    );
                    // If successful, notify the user about the update, and display the updated tasks.
                    // Create and send the embed
                    const embed = await embedTemplates.tasks_template(tasks_result, interaction.user.username);
                    await interaction.channel.send({ embeds: [embed] });
                    
                    await interaction.reply(`Task with ID: ${taskid} updated.`);
                    db_client.release();
                } catch (err) {
                    console.log(`Error querying tasks: ${err}`);
                    await interaction.reply('Invalid task ID!');
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