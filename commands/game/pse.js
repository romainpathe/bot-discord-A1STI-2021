const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");
const fs = require("fs");

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var inprocess = false;


module.exports = {
    name: "pse",
    description: "Pse game",
    run: async (client, message, args) => {
        var config = fs.readFileSync("/var/www/bots-production/bot-romainp/storage/games/pse/config.json");
        var players = fs.readFileSync("/var/www/bots-production/bot-romainp/storage/games/pse/players.json");
        var event = fs.readFileSync("/var/www/bots-production/bot-romainp/storage/games/pse/event.json");
        config = JSON.parse(config);
        players = JSON.parse(players);
        event = JSON.parse(event);
        message.delete()
        let plays = {
            players: {
            },
        };
        let playerlist = [];
        // console.log(client.emojis.cache.map((e, x) => e + ' | ' +e.name).join('\n'))
        if (args[0] == "start") {
            if(!inprocess){
                if (config.active) {
                    config.nbgame = config.nbgame+1
                    inprocess = true;
                    let gamestart = new MessageEmbed()
                        .setTitle(config.name)
                        .setColor(config.color)
                        .setFooter("Partie #" + config.nbgame)
                        .setDescription(`${client.emojis.cache.get(config.emoji.yes)} Une partie vient d’être lancée, cliquez sur la réaction ${client.emojis.cache.get(config.emoji.game)} afin de participer !
                         Vous avez ${config.time} secondes pour vous inscrire !`);
                        message.guild.channels.cache.get(config.channelstart).send(gamestart).then(msg => {
                        msg.react(client.emojis.cache.get(config.emoji.game))
                        message.guild.channels.cache.get(config.channelstart).send(`<@&${config.role}>`).then(msg2 =>{
                                msg2.delete()
                        })
                        const filter = (reaction, user) => reaction.emoji.id === config.emoji.game;
                        const collector = msg.createReactionCollector(filter, { time: config.time * 1000 });
                        collector.on('collect', r => {
                            r.users.cache.filter(user => user.bot == false).map(user => {
                                if (user != undefined) {
                                    if (!players[user.id]) {
                                        players[user.id] = {
                                            "level": 0,
                                            "xp": 0
                                        }
                                    }
                                }
                            });
                            // if (user) {
                            //     let confirmuser = new MessageEmbed()
                            //         .setTitle(config.name)
                            //         .setColor(config.color)
                            //         .setDescription(`${client.emojis.cache.get(config.emoji.yes)} Tu vient bien de t'inscrire au jeu !`)
                            //     user.send(confirmuser)
                            // }
                        });
                        new Promise(resolve => {
                            nb = 0;
                            collector.on('end', collected => collected.get(config.emoji.game).users.cache.filter(user => user.bot == false).map(user => {
                                nb++;
                                plays.players[user.id] = {
                                    heal: {
                                        1: config.players.heal["1"],
                                        2: config.players.heal["2"]
                                    }
                                }
                                playerlist.push(user.id)
                                if (collected.size == nb) {
                                    resolve()
                                }
                            }));
                        }).then(() => {
                            let promise2
                            for (let i = 1; i <= config.tour; i++) {
                                promise2 = new Promise(resolvetour => {
                                    let promises = [];
                                    let description = "";
                                    playerlist.forEach(player => {
                                        promises.push(new Promise(resolve => {
                                            let selectplayer = players[player]
                                            let selectevent;
                                            let validate = false;
                                            do {
                                                selectevent = event[getRandomIntInclusive(0, event.length - 1)]
                                                if (selectevent.month.includes(i)) {
                                                    if (selectevent.level <= selectplayer.level) {
                                                        let pourcent = getRandomIntInclusive(0, 100)
                                                        if (pourcent <= selectevent.rarity) {
                                                            validate = true;
                                                            let name;
                                                            if (message.guild.members.cache.get(player).nickname) {
                                                                name = message.guild.members.cache.get(player).nickname
                                                            } else {
                                                                name = message.guild.members.cache.get(player).user.username
                                                            }
                                                            sentence = selectevent.sentence.replace('{player}', "**" + name + "**");
                                                            description = description + sentence + "\n"
                                                            plays.players[player].heal[selectevent.action] = plays.players[player].heal[selectevent.action] + selectevent.value
                                                        }
                                                    }
                                                }
                                            } while (!validate)
                                            if (validate) resolve();
                                        }))
                                    })
                                    Promise.all(promises).then(() => {
                                        var resultembed = new MessageEmbed()
                                            .setTitle(config.name + " - Mois #" + i)
                                            .setColor(config.color)
                                            .setDescription(description)
                                            .setFooter("Partie #" + config.nbgame)
                                        message.guild.channels.cache.get(config.channelresult).send(resultembed)
                                        resolvetour()
                                    })
                                });
                            }
                            Promise.all([promise2]).then(() => {
                                let endpromise = [];
                                let desc = "";
                                playerlist.forEach(player => {
                                    let win = true
                                    for (let i = 1; i <= 2; i++) {
                                        endpromise = new Promise(resolve => {
                                            if (plays.players[player].heal[i] < config.win.heal[i]) {
                                                win = false
                                            }
                                            resolve()
                                        })
                                    }
                                    let name;
                                    if (message.guild.members.cache.get(player).nickname) {
                                        name = message.guild.members.cache.get(player).nickname
                                    } else {
                                        name = message.guild.members.cache.get(player).user.username
                                    }
                                    if (win == true) {
                                        desc = desc + "**" + name + "** à réussi son année !\n";
                                        players[player].xp = players[player].xp + 150;
                                        if (players[player].xp / (players[player].level + 1) >= config.nextlevelxp) {
                                            players[player].level = players[player].level + 1
                                            players[player].xp = 0;
                                        }
                                    }
                                })
                                Promise.all([endpromise]).then(() => {
                                    if (!desc) {
                                        desc = "Il n'y a pas de gagnant !"
                                    }
                                    var winembed = new MessageEmbed()
                                        .setTitle(config.name + " - Liste des gagnants")
                                        .setColor(config.color)
                                        .setDescription(desc)
                                        .setFooter("Partie #" + config.nbgame)
                                    message.guild.channels.cache.get(config.channelstart).send(winembed)
                                    inprocess = false;
                                    fs.writeFileSync("/var/www/bots-production/bot-romainp/storage/games/pse/config.json", JSON.stringify(config))
                                    fs.writeFileSync("/var/www/bots-production/bot-romainp/storage/games/pse/players.json", JSON.stringify(players))
                                    top(message, message.guild.channels.cache.get(config.channelstart), config)
                                })
                            });
                        })
                    })
                } else {
                    let noactif = new MessageEmbed()
                        .setTitle(config.name)
                        .setColor(config.color)
                        .setDescription(`${client.emojis.cache.get(config.emoji.warning)} Le jeux n'est pas ouvert, merci de contactez un administrateur !`)
                    message.channel.send(noactif).then(element => {
                        setTimeout(function () { element.delete() }, 10000);
                    })
                }
            }else{
                let inprogress = new MessageEmbed()
                    .setTitle(config.name)
                    .setColor(config.color)
                    .setDescription(`${client.emojis.cache.get(config.emoji.warning)} Un jeu est actuellement en cours, vous pouvez vous inscrire a celui-ci !`)
                message.channel.send(inprogress).then(element => {
                    setTimeout(function () { element.delete() }, 10000);
                })
            }
        }else if(args[0] == "join"){
            message.member.roles.add(message.guild.roles.cache.get(config.role))
            message.author.send(
                new MessageEmbed()
                .setTitle(config.name)
                .setColor(config.color)
                .setDescription(`${client.emojis.cache.get(config.emoji.yes)} Vous venez d'activer les notifications pour le jeu !`)
            )
        } else if (args[0] == "leave") {
            message.member.roles.remove(message.guild.roles.cache.get(config.role))
            message.author.send(
                new MessageEmbed()
                    .setTitle(config.name)
                    .setColor(config.color)
                    .setDescription(`${client.emojis.cache.get(config.emoji.no)} Vous venez de désactivé les notifications pour le jeu !`)
            )
        }else if(args[0] == "top"){
            if (Number.isInteger(Number.parseInt(args[1]))){
                config.top = Number.parseInt(args[1])
            }
            top(message, message.channel, config)

        }

    }
}


function top(message, channel, config){
    var players = fs.readFileSync("/var/www/bots-production/bot-romainp/storage/games/pse/players.json");
    players = JSON.parse(players);
    let playerplay = [];
            let playertop = [];
            let promises = [];
            message.guild.members.cache.filter(user => user.user.bot != true).map(user =>{
                if (players[user.user.id]){
                    playerplay.push(user.user.id)
                }
            })
            for (let i = 0; i<config.top; i++) {
                promises.push(new Promise(resolve=>{
                    let promise2 = [];
                    let toplevel = 0;
                    let topxp = 0 ;
                    let topplayer = "";
                    playerplay.forEach(element => {
                        promises.push(new Promise(resolve1=>{
                            if (players[element].level >= toplevel){
                                if (players[element].level > toplevel){
                                    topplayer = element;
                                    toplevel = players[element].level;
                                    topxp = players[element].xp;
                                } else {
                                    if (players[element].xp > topxp) {
                                        topplayer = element
                                        toplevel = players[element].level;
                                        topxp = players[element].xp;
                                    }
                                }
                            }
                            resolve1()
                        }))
                    });
                    Promise.all(promise2).then(() =>{
                        resolve()
                    })
                    playertop.push(topplayer)
                    playerplay.splice(playerplay.indexOf(topplayer), 1)
                }))
            }
            let description = ""
            let nb = 1;
            Promise.all(promises).then(() =>{
                playertop.forEach(element =>{
                    promises.push(new Promise(resolve=>{
                        let name;
                        if(element){
                            if (message.guild.members.cache.get(element).nickname) {
                                name = message.guild.members.cache.get(element).nickname
                            } else {
                                name = message.guild.members.cache.get(element).user.username
                            }
                            description = description + "**#" + nb + "** - **" + name + "** aux niveaux " + players[element].level + " et avec " + players[element].xp + " xp\n"
                            nb++;
                        }
                        resolve()
                    }))
                })
            })
            

            Promise.all(promises).then(()=>{
                channel.send(
                    new MessageEmbed()
                        .setTitle(config.name+" - Classement #"+config.top)
                        .setColor(config.color)
                        .setDescription(`${description}`)
                )
            })
}