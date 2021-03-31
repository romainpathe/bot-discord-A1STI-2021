const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");
const fs = require("fs");




let authorize = false;
let inprogress = false;

function CancelSondage(config, message, client){
        let stopvalid = new MessageEmbed()
            .setTitle(`${client.emojis.cache.get(config.emoji.vote)} Annulation d'un sondage !`)
            .setColor(config.color)
            .setDescription(`${client.emojis.cache.get(config.emoji.no)} Vous avez mit trop de temps à finir le sondage ou vous avez annulé le sondage !`)
        message.author.send(stopvalid).then(msg => {
            setTimeout(function () { msg.delete() }, 20000);
        })
        console.log("Sondage Annulé !")
        return false;
}

module.exports = {
    name: "sondage",
    description: "Créer un sondage",
    run: async (client, message, args) => {
        message.delete()
        // console.log(client.emojis.cache.map((e, x) => e + ' | ' +e.name).join('\n'))
        var config = fs.readFileSync("/var/www/bots-production/bot-romainp/storage/sondage/config.json");
        config = JSON.parse(config);
        
        config.whitelist.forEach(id => {
            if(id == message.author.id){
                authorize = true;
            }
        }) 

        if (args[0] == "add" && message.author.id == "251801773486899210"){
            let is = false;
            let promises = []
            config.whitelist.forEach(e=>{
                promises.push(new Promise((resolve) => { 
                    if (e == message.mentions.users.first().id) {
                        is = true
                    }
                    resolve()
                }))
            })
            Promise.all(promises).then(()=>{
                if (!is) {
                    config.whitelist.push(message.mentions.users.first().id)
                    fs.writeFileSync("/var/www/bots-production/bot-romainp/storage/sondage/config.json", JSON.stringify(config));
                }
            })
        } else if (args[0] == "remove" && message.author.id == "251801773486899210") {
            let promises = []
            for (let i = 0; config.whitelist > i; i++){
                promises.push(new Promise((resolve) => { 
                    if (config.whitelist[i] == message.mentions.users.first().id){
                        config.whitelist.splice(i, 1);
                        fs.writeFileSync("/var/www/bots-production/bot-romainp/storage/sondage/config.json", JSON.stringify(config));
                    }
                    resolve()
                }))
            }
        }else if (!authorize || inprogress){
            let noperm = new MessageEmbed()
                .setTitle(`${client.emojis.cache.get(config.emoji.vote)} Sondage`)
                .setColor(config.color)
                .setDescription(`${client.emojis.cache.get(config.emoji.no)} Vous n'avez pas la permission de créer un sondage, Merci de contacter un administrateur`)
            message.channel.send(noperm).then(element => {
                setTimeout(function () { element.delete() }, 10000);
            })
        }else{
            inprogress = true;
            let sondageembed = {
                description: "",
                color: config.color
            };
            message.guild.channels.create("sondage-" + config.nbsondage, {
                type: "text",
                parent: message.guild.channels.cache.get(config.category),
                permissionOverwrites: [
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS'],
                    },
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                ],
            }).then(channel => {
                channel.send("<@"+message.author.id+">")
                let createsondage = new MessageEmbed()
                    .setTitle("Création d'un sondage :")
                    .setColor(config.color)
                    .setFooter('Pour annuler le sondage taper cancel !')
                    .setDescription(`1. ${client.emojis.cache.get(config.emoji.no)} Saisir la question\n2. ${client.emojis.cache.get(config.emoji.no)} Saisir les réponses possible (Une par ligne, maximum 11)\n3. ${client.emojis.cache.get(config.emoji.no)} Envoye du sondage`)
                message.guild.channels.cache.get(channel.id).send(createsondage).then(msg => {
                    lastmsgid = msg.id;
                })
                let cancelcollect = channel.createMessageCollector(m => m.author.id === message.author.id && m.content == "cancel", {time:600000});
                cancelcollect.on("collect", () =>{
                    cancelcollect.stop();
                    collector.stop();
                    inprogress = CancelSondage(config, message, client)
                    channel.delete();
                })

                let filter = m => m.author.id === message.author.id && message.content != "cancel";
                let collector = channel.createMessageCollector(filter, { time: 120000 });
                collector.on('collect', m => {
                    collector.stop();
                    sondageembed.title = m.content;
                    let createsondage = new MessageEmbed()
                        .setTitle("Création d'un sondage :")
                        .setColor(config.color)
                        .setFooter('Pour annuler le sondage taper cancel !')
                        .setDescription(`1. ${client.emojis.cache.get(config.emoji.yes)} Saisir la question\n2. ${client.emojis.cache.get(config.emoji.no)} Saisir les réponses possible (Une par ligne, maximum 11)\n3. ${client.emojis.cache.get(config.emoji.no)} Envoye du sondage`)
                    message.guild.channels.cache.get(channel.id).send(createsondage).then(msg => {
                        
                        let collectormsg = channel.createMessageCollector(filter, { time: 120000 });
                        collectormsg.on('collect', m => {
                            if (m.content != "cancel"){
                            collectormsg.stop();
                            let option = m.content.split("\n")
                            let promises = []
                            for (let i = 0; option.length > i; i++) {
                                promises.push(new Promise((resolve)=>{
                                    switch (i) {
                                        case 0:
                                            sondageembed.description = sondageembed.description +"0️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 1:
                                            sondageembed.description = sondageembed.description +"1️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 2:
                                            sondageembed.description = sondageembed.description + "2️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 3:
                                            sondageembed.description = sondageembed.description +"3️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 4:
                                            sondageembed.description = sondageembed.description +"4️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 5:
                                            sondageembed.description = sondageembed.description +"5️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 6:
                                            sondageembed.description = sondageembed.description +"6️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 7:
                                            sondageembed.description = sondageembed.description +"7️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 8:
                                            sondageembed.description = sondageembed.description +"8️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 9:
                                            sondageembed.description = sondageembed.description +"9️⃣ : " + option[i] + "\n";
                                            resolve()
                                            break;
                                        case 10:
                                            sondageembed.description = sondageembed.description+"🔟 : " + option[i]+"\n";
                                            resolve()
                                            break;
                                        default:
                                            sondageembed.description = sondageembed.description+"Vous avez mit trop de résultat possible ou une erreur interne c'est produite ! \n";
                                            resolve()
                                            break;
                                    }
                                }))
                            }

                            Promise.all(promises).then(() => {
                                message.guild.channels.cache.get(config.sondageChannel).send(new MessageEmbed(sondageembed).setFooter("Sondage fait par " + message.author.username+" #" + config.nbsondage)).then(endmsg => {
                                    for (let i = 0; option.length > i; i++) {
                                        switch (i) {
                                            case 0:
                                                endmsg.react(`0️⃣`)
                                                break;
                                            case 1:
                                                endmsg.react(`1️⃣`)
                                                break;
                                            case 2:
                                                endmsg.react(`2️⃣`)
                                                break;
                                            case 3:
                                                endmsg.react(`3️⃣`)
                                                break;
                                            case 4:
                                                endmsg.react(`4️⃣`)
                                                break;
                                            case 5:
                                                endmsg.react(`5️⃣`)
                                                break;
                                            case 6:
                                                endmsg.react(`6️⃣`)
                                                break;
                                            case 7:
                                                endmsg.react(`7️⃣`)
                                                break;
                                            case 8:
                                                endmsg.react(`8️⃣`)
                                                break;
                                            case 9:
                                                endmsg.react(`9️⃣`)
                                                break;
                                            case 10:
                                                endmsg.react(`🔟`)
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    inprogress = false;
                                    channel.delete()
                                    config.nbsondage = config.nbsondage+1
                                    fs.writeFileSync("/var/www/bots-production/bot-romainp/storage/sondage/config.json", JSON.stringify(config));
                                })
                            })
                            }
                        });

                    })

                });
            });
        }
    }
}