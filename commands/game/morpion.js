const MessageEmbed = require('discord.js').MessageEmbed;
const { formatDate } = require("../../functions.js");
const fs = require("fs");

var inprocess = false;


module.exports = {
    name: "morpion",
    description: "Morpion game",
    run: async (client, message, args) => {

        
        message.reply("Jeu en cours de développement")


        var config = fs.readFileSync("/var/www/bots-production/bot-romainp/storage/games/morpion/config.json");
        config = JSON.parse(config);

        new Promise((resolve, reject) => {
            var players = {
                one: null,
                two: null
            }
            message.channel.send(new MessageEmbed({ title: config.name, description: "Cliquez sur la réaction pour rejoindre la partie !", color: config.color }))
                .then((msg) => {
                    msg.react(config.emoji.game)
                    const collector = msg.createReactionCollector((reaction) => reaction.emoji.id === config.emoji.game, { time: 10000 });
                    collector.on('collect', r => {
                        r.users.cache.filter(user => user.bot == false).map(user => {
                            if (players.one == null && user.bot == false && players.one != user.id) {
                                players.one = user.id
                            } else if (players.two == null && players.one != user.id && players.two != user.id && user.bot == false) {
                                players.two = user.id
                            }
                        });
                    });
                    collector.on('end', () => {
                        if(players.one && players.two){
                            resolve(players)
                        }else{
                            reject()
                        }
                    })
                })

        }).then(playerlist =>{
            StartGame(config, message, playerlist)
        }).catch(()=>{
            message.channel.send("Il n'y a pas assez de joueur inscrit pour lancer une partie !")
        })

    }
}

function StartGame(config, message, playerlist) {
    playerlist = {
        one: {
            id: playerlist.one,
            icon: "X"
        },
        two: {
            id: playerlist.two,
            icon: "O"
        }
    }
    InGame(config, message, playerlist)
}

function InGame(config, message, playerlist){
    let inPlayer = "one";
        win = false;
        maps = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]
        promises2 = [];
        playerwin = "one";
        morpionMaps = new MessageEmbed()
            .setTitle(`C'est a ${message.guild.members.cache.get(playerlist[inPlayer].id).nickname} de jouer.`)
            .setColor(config.color)
            .setDescription(`\`\`\`*******************\n|  ${maps[0][0]}  |  ${maps[0][1]}  |  ${maps[0][2]}  |\n|  ${maps[1][0]}  |  ${maps[1][1]}  |  ${maps[1][2]}  |\n|  ${maps[2][0]}  |  ${maps[2][1]}  |  ${maps[2][2]}  |\n*******************\`\`\``)

        message.channel.send(morpionMaps).then(msg => {
            msg.react("1️⃣")
            msg.react("2️⃣")
            msg.react("3️⃣")
            msg.react("4️⃣")
            msg.react("5️⃣")
            msg.react("6️⃣")
            msg.react("7️⃣")
            msg.react("8️⃣")
            msg.react("9️⃣")

        let collect = msg.createReactionCollector(react => react.emoji.name == "1️⃣" || react.emoji.name == "2️⃣" || react.emoji.name == "3️⃣" || react.emoji.name == "4️⃣" || react.emoji.name == "5️⃣" || react.emoji.name == "6️⃣" || react.emoji.name == "7️⃣" || react.emoji.name == "8️⃣" || react.emoji.name == "9️⃣", { time: 300000 })
            collect.on("collect", r => {
                if (r.users.cache.filter(user => user.bot == false).last() != null) {
                    if (r.users.cache.filter(user => user.bot == false).last().id == playerlist[inPlayer].id) {
                        switch (r._emoji.name) {
                            case `1️⃣`:
                                if (maps[0][0] === " "){
                                    maps[0][0] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `2️⃣`:
                                if (maps[0][1] === " "){
                                    maps[0][1] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `3️⃣`:
                                if (maps[0][2] === " "){
                                    maps[0][2] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `4️⃣`:
                                if (maps[1][0] === " "){
                                    maps[1][0] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `5️⃣`:
                                if (maps[1][1] === " "){
                                    maps[1][1] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `6️⃣`:
                                if (maps[1][2] === " "){
                                    maps[1][2] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `7️⃣`:
                                if (maps[2][0] === " ") {
                                    maps[2][0] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `8️⃣`:
                                if (maps[2][1] === " ") {
                                    maps[2][1] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                            case `9️⃣`:
                                if (maps[2][2] === " ") {
                                    maps[2][2] = playerlist[inPlayer].icon
                                    win = checkWin(maps)
                                    playerwin = inPlayer;
                                    if (inPlayer == "one") {
                                        inPlayer = "two"
                                    } else {
                                        inPlayer = "one"
                                    }
                                }
                                break;
                        }
                        
                        morpionMaps = new MessageEmbed({
                            title: `C'est a ${message.guild.members.cache.get(playerlist[inPlayer].id).nickname} de jouer.`,
                            description: `\`\`\`*******************\n|  ${maps[0][0]}  |  ${maps[0][1]}  |  ${maps[0][2]}  |\n|  ${maps[1][0]}  |  ${maps[1][1]}  |  ${maps[1][2]}  |\n|  ${maps[2][0]}  |  ${maps[2][1]}  |  ${maps[2][2]}  |\n*******************\`\`\``,
                            color: config.color
                        })
                        msg.edit(morpionMaps)

                        if(win){
                            collect.stop()
                            message.channel.send(`Félicitation à ${message.guild.members.cache.get(playerlist[playerwin].id).nickname} qui vient de remporter la partie !`)
                        }
                    }

                }
            })

            collect.on("end", () =>{
                message.channel.send("Partie terminé !")
            })

        })

}

function checkWin(maps){
    let win = false;
    if (maps[0][0] == maps[0][1] && maps[0][0] == maps[0][2] && maps[0][0] != " "){
        win = true;
    } else if (maps[1][0] == maps[1][1] && maps[1][0] == maps[1][2] && maps[1][0] != " ") {
        win = true;
    } else if (maps[2][0] == maps[2][1] && maps[2][0] == maps[2][2] && maps[2][0] != " ") {
        win = true;
    } else if (maps[0][0] == maps[1][0] && maps[0][0] == maps[2][0] && maps[0][0] != " ") {
        win = true;
    } else if (maps[0][1] == maps[1][1] && maps[0][1] == maps[2][1] && maps[0][1] != " ") {
        win = true;
    } else if (maps[0][2] == maps[1][2] && maps[0][2] == maps[2][2] && maps[0][2] != " ") {
        win = true;
    } else if (maps[0][0] == maps[1][1] && maps[0][0] == maps[2][2] && maps[1][1] != " ") {
        win = true;
    } else if (maps[0][2] == maps[1][1] && maps[0][2] == maps[2][0] && maps[1][1] != " ") {
        win = true;
    }
    
    return win;    
}


