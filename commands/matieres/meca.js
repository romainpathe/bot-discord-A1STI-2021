const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "meca",
    description: "Nouvelle fiche de meca",
    run: async (client, message, args) => {
        let embed = new MessageEmbed()
            .setColor('E71307')
            .setTitle(args[0])
            .addField('Version :', args[1])
            .addField('Date de publication :', formatDate(message.createdAt))
            .addField('Modification :', args.slice(2).toString().replace(/,/gi, ' '))
            .setURL(message.attachments.first().url)
        message.guild.channels.cache.get('760498804666794056').send(embed);
    }
}
