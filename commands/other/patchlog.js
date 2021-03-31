const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "patchlog",
    description: "Créer un patchlog",
    run: async (client, message, args) => {
        let matiere = args[0]
        let fiche = args[1]
        let date = new Date()
        let string = "";
        args.splice(0, 2)
        args.forEach(element => {
            string = string+element +" "
        });
        let annee = date.getFullYear()
        let mois = date.getMonth() + 1
        if (mois.toString().length !=2){
            mois = "0"+mois
        } 
        let jour = date.getDate()
        if (jour.toString().length != 2) {
            jour = "0" + jour
        }
        message.guild.channels.cache.get('801485843478216735').send(`**Modification du** : ${jour}/${mois}/${annee} \n**Matière** : ${matiere} \n**Fiche** : ${fiche} ${string}`);
    }
}
