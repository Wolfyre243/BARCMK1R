const { Events } = require('discord.js');
const { db_client } = require('../databasing/database-client.js');

// 1242754476914249779
module.exports = {
	name: Events.ClientReady,
	once: true,
    // When the client is ready, run this code (only once).
    // The name of this function shouldn't matter
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Attempt to establish a database connection
		try {
			db_client.connect(); // Connect to the PostgreSQL database.
			console.log('Connected to PostgreSQL.\nDatabase: test-db');
			// Send a successful connection
			client.channels.cache.get("1242754476914249779").send("Successfully connected to PostgreSQL.");
		} catch (err) {
			console.log(err);
		}
	},
};