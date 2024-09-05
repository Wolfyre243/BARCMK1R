const { EmbedBuilder } = require('discord.js');

module.exports = {
    tasks_template: (tasklist, username) => {
        // Convert the tasklist into a string
        let taskStr = '';
        let count = 0;
        for (let task of tasklist.rows) {
            //console.log(task.date_due)
            if (task.date_due === null) {
                taskStr += `${++count}. ${task.name} No Due Date \t ${task.completed ? "Yes" : "No"} \n`;
            } else {
                const taskDue = new Date(task.date_due);
                taskStr += `${++count}. ${task.name} ${taskDue.toLocaleDateString('en-GB')} \t ${task.completed ? "Yes" : "No"} \n`;
            }
        }

        return new EmbedBuilder()
            .setColor([35, 127, 235]) // Blue
            .setAuthor({ name: `For ${username}, returning ${tasklist.rowCount} tasks.` })
            .setTitle('Task List')
            .setDescription("No. | Name | Due | Completed?\n" + taskStr)
            .setThumbnail('https://static.vecteezy.com/system/resources/thumbnails/025/279/791/small_2x/white-red-chicken-isolated-on-the-background-generative-ai-png.png')
            .setTimestamp()
            .setFooter({ text: 'Cool quote here' }); // TODO: Find a quote generator API
    } 
}