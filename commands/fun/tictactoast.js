module.exports.info = {
    name: 'tictactoast',
    aliases: ['ttt', 'tictactoe'],
    cooldown: 20,
    section: 'fun',
    description: 'TicTacToe but nothing is different at all',
    usage: 'ttt/tictactoe/tictactoast <@ someone>'
}

const { MessageEmbed, MessageActionRow, MessageButton, Collection } = require("discord.js");
const boardInit = (game) => {
    var array2D = [];
    game.board.forEach((row, x) => {
        var ActionRow = new MessageActionRow();
        row.forEach((square, y) => {
            var specs;
            if (!square)specs = { style: 'SECONDARY', label: ' ', disabled: false };
            else if (square == 'x')specs = { style: 'PRIMARY', label: 'X', disabled: true };
            else if (square == 'o')specs = { style: 'DANGER', label: 'O', disabled: true };
            else if (square == 'fin')specs = { style: 'SECONDARY', label: ' ', disabled: true };
            ActionRow.addComponents(
                new MessageButton()
                    .setCustomId(`tictactoast_${x}${y}_${game.turn}_fun`)
                    .setStyle(specs.style)
                    .setLabel(specs.label)
                    .setDisabled(specs.disabled)
            );
        });
        array2D.push(ActionRow);
    });
    return array2D;
}
const hasWon = (board) => {
    var tie = true;
    var hor = false;
    board.forEach(row => {
        if (row[0] == 'x' && row[1] == 'x' && row[2] == 'x')hor = 'x';
        if (row[0] == 'o' && row[1] == 'o' && row[2] == 'o')hor = 'o';
        row.forEach(square => {
            if (!square)tie = false;//tie
        });
    });//horizontal
    if (hor == 'o' || hor == 'x')return hor;
    for (let i = 0; i < 3; i ++) {
        if (board[0][i] == 'x' && board[1][i] == 'x' && board[2][i] == 'x')return 'x';
        if (board[0][i] == 'o' && board[1][i] == 'o' && board[2][i] == 'o')return 'o';
    }//vertical
    if (board[0][0] == 'x' && board[1][1] == 'x' && board[2][2] == 'x')return 'x';
    if (board[0][0] == 'o' && board[1][1] == 'o' && board[2][2] == 'o')return 'o';
    if (board[0][2] == 'x' && board[1][1] == 'x' && board[2][0] == 'x')return 'x';
    if (board[0][2] == 'o' && board[1][1] == 'o' && board[2][0] == 'o')return 'o';//diagonals
    if (tie)return 'tie';//tie
    return false;//none
} 

module.exports.run = async (client, message, args) => { 
    var embed = new MessageEmbed().setColor("#ff0000").setTitle("** **              TicTacToe              ** **");
    const target = message.mentions.members.first();
    if (!target)embed.setDescription("❌ You have to specify a valid person to verse!");
    else if (target.id == message.author.id)embed.setDescription("❌ You can't play TicTacToe by yourself!").setFooter("Are you really this lonely?");
    else if (client.games.has(message.author.id + target.id))embed.setDescription(`❌ You're already in a game with ${target}!`);
    else {
        const turn = Math.round(Math.random()) ? message.author.id : target.id;
        const turner = await client.users.fetch(turn);
        const game = {
            turn: turn,
            board: [
                ["", "", ""], 
                ["", "", ""], 
                ["", "", ""]
            ]
        };
        client.games.set(parseInt(message.author.id) + parseInt(target.id), game);
        client.games.set(message.author.id, target.id);
        client.games.set(target.id, message.author.id);
        await message.reply({
            embeds: [embed.setAuthor(`${turner.username}'s turn! ${message.author.id > target.id ? "🔴" : "🔵"}`, turner.displayAvatarURL({format: 'png'}))],
            components: boardInit(game)
        });  
    }
}     

module.exports.button = async (client, interaction) => {
    var embed = new MessageEmbed().setColor("#ff0000").setTitle("** **              TicTacToe              ** **");
    const target = await client.games.get(interaction.user.id);
    var games = client.games.get(parseInt(interaction.user.id) + parseInt(target));
    games.board[interaction.customId.split('_')[1].charAt(0)][interaction.customId.split('_')[1].charAt(1)] = interaction.user.id > target ? "x" : "o";
    games.turn = target;
    const winner = await client.users.fetch(interaction.user.id);
    const turner = await client.users.fetch(target);
    const turnout = hasWon(games.board);
    if (turnout == 'x' || turnout == 'o') {
        games.board = games.board.map(row => {
            return row.map(square => {
                if (!square)return 'fin';
                return square; 
            });
        });
        client.games.delete(parseInt(interaction.user.id) + parseInt(target));
        embed.setAuthor(`${winner.username} has won! ${target > interaction.user.id ? "🔴" : "🔵"}`, winner.displayAvatarURL({format: 'png'}));
    } else if (turnout == 'tie') {
        client.games.delete(parseInt(interaction.user.id) + parseInt(target));
        embed.setDescription('Aw it was a tie.');
    } else {
        await client.games.set(parseInt(interaction.user.id) + parseInt(target), games);
        embed.setAuthor(`${turner.username}'s turn! ${interaction.user.id > target ? "🔴" : "🔵"}`, turner.displayAvatarURL({format: 'png'}));
    };
    await interaction.update({
        embeds: [embed],
        components: boardInit(games)
    });  
}
