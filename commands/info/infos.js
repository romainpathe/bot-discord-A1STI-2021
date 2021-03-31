/**
 * Info Bot
 * Info Serveur
 * Info count (nb membre, nb bot, nb humain)
 */

const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "infos",
    description: "Returns info of bot, server and member",
    run: async (client, message, args) => {



        let embed = new MessageEmbed()
            .setColor('2f3136')
            .setAuthor(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`
            **❯ Information du serveur :**
            Propriétaire : ${message.guild.owner}
            Identifiant unique : \`${message.guild.id}\`
            Serveur créer le : \`${formatDate(message.guild.createdAt)}\`
            Région : \`${message.guild.region}\`
            `)
            .setFooter(`Bot réalisé par Clashoux • Tous droit réservé !`)
        message.channel.send(embed);

    }
}
