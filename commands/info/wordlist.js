const MessageEmbed = require('discord.js').MessageEmbed;
module.exports = {
    name: "wordlist",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        message.delete();

        let embed = new MessageEmbed()
            .setColor('2f3136')
            .setTitle("Mini Liste")
            .setThumbnail(message.guild.iconURL())
            .setDescription(`
            LAZARE
            LAMBERT
            EMMIE
            MARINE
            LUCAS
            LOUIS
            FDP
            TOM
            ALEX
            LUDO
            CALVITIE
            LISA
            DAN
            CHARLES
            S
            BETTAIEB
            IZRI
            HAMED
            VIGNERON`)
            .setFooter(`Liste des mots auquel le bot réagit !`)

            message.channel.send(embed);

    }
}
