const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "profil",
    description: "Returns profil of user",
    run: async (client, message, args) => {
        
        

        let user = message.member,
            nickname,
            joinedAt = formatDate(user.joinedAt),
            createdAt = formatDate(user.user.createdAt),
            status = user.user.presence.status,
            roles = []
        if (user.nickname == null){
            nickname = message.author.username;
        }else{
            nickname = user.nickname;
        }

        if(status == "offline") {
            status = "Hors ligne"
        } else if(status == "online"){
            status = "En ligne"
        } else if (status == "idle") {
            status = "Absent"
        } else if (status == "dnd") {
            status = "Ne pas déranger"
        }else{
            status = "Error"
        }
        
        user._roles.forEach(function(roleid){
            let role = message.guild.roles.cache.get(roleid);
            roles.push(role);
        })

        let embed = new MessageEmbed()
            .setColor('2f3136')
            .setAuthor(message.author.tag)
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`
            **❯ Information de l'utilisateur :**
            Profil : ${message.author}
            Identifiant unique : \`${user.id}\`
            Status : \`${status}\`
            Compte créer le : \`${createdAt}\`
            \n
            **❯ Information du membre :**
            Nickename : \`${nickname}\`
            A rejoint le : \`${joinedAt}\`
            Rôles (${roles.length}): ${roles}
            `)
            .setFooter(`Bot réalisé par Clashoux • Tous droit réservé !`)
        message.channel.send(embed);

    }
}
