const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "maths",
    description: "Nouvelle fiche de maths",
    run: async (client, message, args) => {

        if(args[0] === "fiche"){
            let embed = new MessageEmbed()
                .setColor('119BE6')
                .setTitle(args[1])
                .addField('Version :', args[2])
                .addField('Date de publication :', formatDate(message.createdAt))
                .addField('Modification :', args.slice(3).toString().replace(/,/gi, ' '))
                .setURL(message.attachments.first().url)
            message.guild.channels.cache.get('760494761109880882').send(embed);
        } else if (args[0] === "feuille"){
            let embed = new MessageEmbed()
                .setColor('119BE6')
                .setTitle('Feuille '+args[1])
                .addField('Date de rendu : ', args[2])
                .setURL(message.attachments.first().url)
            message.guild.channels.cache.get('760545501883400202').send(embed);
        }

        
    }
}
