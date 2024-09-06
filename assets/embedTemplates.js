const { EmbedBuilder } = require('discord.js');
const Quotes = require('../assets/quotes.js');



module.exports = {
    tasks_template: async (tasklist, username) => {
        // Convert the tasklist into a string
        let taskStr = '';
        let count = 0;
        for (let task of tasklist.rows) {
            //console.log(task.date_due)
            if (task.date_due === null) {
                taskStr += `${++count}. ${task.name} No Due Date ${task.completed ? "Yes" : "No"} ID: ${task.taskid} \n`;
            } else {
                const taskDue = new Date(task.date_due);
                taskStr += `${++count}. ${task.name} ${taskDue.toLocaleDateString('en-GB')} ${task.completed ? "Yes" : "No"} ID: ${task.taskid} \n`;
            }
        }

        let quote = '';
        await Quotes.getQuote().then((result) => {
            quote = result;
        }, (error) => {
            quote = error;
        })

        return new EmbedBuilder()
            .setColor([35, 127, 235]) // Blue
            .setAuthor({ name: `For ${username}, returning ${tasklist.rowCount} tasks.` })
            .setTitle('Task List')
            .setDescription("No. | Name | Due | Completed? | ID\n" + taskStr)
            .setThumbnail('https://static.vecteezy.com/system/resources/thumbnails/025/279/791/small_2x/white-red-chicken-isolated-on-the-background-generative-ai-png.png')
            .setTimestamp()
            .setFooter({ text: quote }); // TODO: Find a quote generator API
    } 
}