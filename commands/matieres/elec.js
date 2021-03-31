const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "elec",
    description: "Nouvelle fiche de elec",
    run: async (client, message, args) => {
        let embed = new MessageEmbed()
            .setColor('02D314')
            .setTitle(args[0])
            .addField('Version :', args[1])
            .addField('Date de publication :', formatDate(message.createdAt))
            .addField('Modification :', args.slice(2).toString().replace(/,/gi, ' '))
            .setURL(message.attachments.first().url)
        message.guild.channels.cache.get('760498442349969428').send(embed);
    }
}
