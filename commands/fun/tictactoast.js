module.exports.info = {
    name: 'tictactoast',
    aliases: ['ttt', 'tictactoe'],
    cooldown: 40,
    section: 'fun',
    description: 'TicTacToe but nothing is different at all',
    usage: 'ttt/tictactoe/tictactoast <@ someone>'
}

const { MessageEmbed, MessageActionRow, MessageButton, Collection } = require("discord.js");
var games = new Collection(); 


module.exports.run = (client, message, args) => {
    var embed = new Discord.MessageEmbed().setColor("#ff0000").setTitle("** **              TicTacToe              ** **");
    const target = message.mentions.members.first();
    if (!target)embed.setDescription("❌ You have to specify a valid person to verse!");
    else if (target.id == message.author.id)embed.setDescription("❌ You can't play TicTacToe by yourself!").setFooter("Are you really this lonely?");
    else if (games.has(message.author.id + target.id))embed.setDescription(`❌ You're already in a game with ${target}!`);
    else {
        const turn = Math.round(Math.random()) ? message.author : target.user;
        games.set(
            message.author.id + target.id, 
            {
                turn: turn,
                board: [
                    ["", "", ""], 
                    ["", "", ""], 
                    ["", "", ""]
                ]
            }
        );
    }
}