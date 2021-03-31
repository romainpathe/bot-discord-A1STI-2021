const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "control",
    description: "Annoncé un nouveau contrôle",
    run: async (client, message, args) => {
        let embed = new MessageEmbed()
            .setColor('FF6666')
            .setTitle('Contrôle de '+args[0]+' le '+args[1])
            .addField('Matières :', args[0])
            .addField('Chapitre :', args.slice(2).toString().replace(/,/gi, ' '))
        message.guild.channels.cache.get('761565947613937724').send(embed);
    }
}
