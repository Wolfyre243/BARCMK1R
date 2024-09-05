const { SlashCommandBuilder, inlineCode } = require('discord.js');
const db = require('../../databasing/db-access.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('createtask')
            .setDescription('Creates a new task for the user (EXPERIMENTAL)')
            .addStringOption(option => 
                option.setName('task-name') // Name of the option
                    .setDescription('The name of the task')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('due-date') // Name of the option
                    .setDescription('The date where the task is due, in the format yyyy-mm-dd or mm/dd/yyyy. This argument is optional.')
            ),
            
    async execute(interaction) {
        // Obtain arguments, define variables, you know the drill
        const user_discordID = interaction.user.id;
        const taskname = interaction.options.getString('task-name');
        const duedateStr = interaction.options.getString('due-date');
        let duedate;

        // Connect to the PostgreSQL database.
        const db_client = await db.getClient();
        // First check if the specified name already exists in the database.
        db.getUIDByDiscord(user_discordID)
            .then(async (userid) => { // resolve
                if (duedateStr != null) { // If user has provided a due date, parse it first.
                    try {
                        duedate = new Date(duedateStr);
                        duedate = duedate.toISOString();
                        // Insert the task into the database
                        await db_client.query(
                            `INSERT INTO tasks (userid, name, date_due)
                            VALUES (${userid}, '${taskname}', '${duedate}')`
                        ) // FIXME: Date converted is 1 day behind the specified date (probably due to timezones)
                        
                        // Reply with the added rows
                        await interaction.channel.send(`Added task: "${taskname}" for user "${interaction.user.username}".`)
                        await interaction.reply("Successfully added task.");
    
                    } catch (err) { // If user entered an invalid date format, end the command and show the error.
                        console.log(err);
                        await interaction.reply('Invalid due date format. Please use the format yyyy-mm-dd or mm/dd/yyyy.');
                    }
                    
                } else { // If user did not provide a due date
                    // Insert the task into the database
                    await db_client.query(
                        `INSERT INTO tasks (userid, name)
                        VALUES (${userid}, '${taskname}')`
                    );
                    // Reply with the added rows
                    await interaction.channel.send(`Added task: "${taskname}" for user "${interaction.user.username}".`)
                    await interaction.reply("Successfully added task.");
                }
                db_client.release();

            }, async (error) => { // Rejected, user does not exist.
                console.log(error);
                await interaction.reply(`You must create an account first! Use the ${inlineCode('/signup')} command to register.`);
            })
            .catch(async (err) => {
                console.log(`Error getting user ID: ${err.message}`);
                await interaction.reply('An error occurred while trying to get your user ID.');
            })
    }
}