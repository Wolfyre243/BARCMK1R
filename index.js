// Bring in the big guns
const fs = require('node:fs'); // Node's native file system module.
const path = require('node:path'); // Node's native path utility module.
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');


// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Adds a new property called "commands" to the client instance
// This allows us to access our commands in other files.
client.commands = new Collection(); // The collection class is an extension of the Map class, which we will be using to store commands

const foldersPath = path.join(__dirname, 'commands'); // Constructs a path to the commands directory. "__dirname" is an environment variable for the root dir.
const commandFolders = fs.readdirSync(foldersPath); // Reads the path to the directory and returns an array of the folders in the "commands" directory.

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Reads the path to the directory and returns an array of files.

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath); // Require the command file and store it in the command variable

        // Set a new item in the Collection
        if ('data' in command && 'execute' in command) { // Check if the command was written properly
            client.commands.set(command.data.name, command) // The key is the command name and the value is the imported module.
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Create an event listener for when a command is executed
// The interactionCreate event fires the arrow function and passes in a BaseInteraction object under the alias "interaction".
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return; // Filter out non-slash commands
    
    // Check if the command exists in the Collection made earlier.
    const command = interaction.client.commands.get(interaction.commandName);

    // End if the command isnt found
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`); // commandName is the name of the command called.
        return;
    }

    // Try to execute the command and catch any errors if needed.
    try {
        await command.execute(interaction); // Perform the "execute" function in the command's module script
    } catch (err) {
        console.error(err);
        if (interaction.replied || interaction.deferred) { // Interaction has already been replied to or deferred, show an error.
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);