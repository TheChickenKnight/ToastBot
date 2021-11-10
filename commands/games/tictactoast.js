module.exports.info = {
    name: 'tictactoast',
    aliases: ['ttt', 'tictactoe'],
    cooldown: 20,
    section: 'games',
    description: 'TicTacToe but nothing is different at all',
    ai: 'maybe at some point...or just random',
    usage: 'ttt/tictactoe/tictactoast <@ someone>'
};

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const boardInit = game => {
    var array2D = [];
    game.board.forEach((row, x) => {
        var ActionRow = new MessageActionRow();
        row.forEach((square, y) => {
            var specs = !square ? { style: 'SECONDARY', label: '🍞', disabled: false } : (square == 'x' ? { style: 'PRIMARY', label: '<:peanutbutter:877666741994541066>', disabled: true } : (square == 'o' ? { style: 'DANGER', label: '<:jam:877665567341948959>', disabled: true } : { style: 'SECONDARY', label: '🍞', disabled: true }));
            ActionRow.addComponents(new MessageButton().setCustomId(`tictactoast_${x}${y}_${game.turn}_games`).setStyle(specs.style).setEmoji(specs.label).setDisabled(specs.disabled));
        });
        array2D.push(ActionRow);
    });
    return array2D;
}
const hasWon = board => {
    var tie = true, hor = false;
    board.forEach(row => {
        if (row[0] == 'x' && row[1] == 'x' && row[2] == 'x')hor = 'x';
        if (row[0] == 'o' && row[1] == 'o' && row[2] == 'o')hor = 'o';
        row.forEach(square => {if (!square)tie = false}); //tie
    });//horizontal
    if (hor)return hor;
    for (let i = 0; i < 3; i ++) {
        if (board[0][i] == 'x' && board[1][i] == 'x' && board[2][i] == 'x')return 'x';
        if (board[0][i] == 'o' && board[1][i] == 'o' && board[2][i] == 'o')return 'o';
    }//vertical
    return hor ? hor : ((board[0][0] == 'x' && board[1][1] == 'x' && board[2][2] == 'x') || (board[0][2] == 'x' && board[1][1] == 'x' && board[2][0] == 'x') ? 'x' : ((board[0][0] == 'o' && board[1][1] == 'o' && board[2][2] == 'o') || (board[0][2] == 'o' && board[1][1] == 'o' && board[2][0] == 'o') ? 'o' : (tie ? 'tie' : false)));
} 

module.exports.run = async (client, message, args) => { 
    var embed = new MessageEmbed().setColor(client.randToastColor()).setTitle("** **              TicTacToe              ** **");
    var target = message.mentions.members.first() ? message.mentions.members.first() : { id: 'bot' };
    if (target.id == message.author.id)embed.setDescription("❌ You can't play TicTacToe by yourself!").setFooter("Are you really this lonely?");
    else if (client.tictactoe.has(message.author.id + target.id))embed.setDescription(`❌ You're already in a game with ${target}!`);
    else {
        const turn = Math.round(Math.random()) ? message.author.id : target.id;
        const turner = (turn == 'bot' ? await client.users.fetch(client.user.id) : await client.users.fetch(turn));
        const game = {
            solo: target.id == 'bot',
            turn: turn,
            board: [ ["", "", ""], ["", "", ""], ["", "", ""] ]
        };
        client.tictactoe.set(parseInt(message.author.id) + parseInt(target.id), game);
        client.tictactoe.set(message.author.id, target.id);
        client.tictactoe.set(target.id, message.author.id);
        await message.reply({
            embeds: [embed.setColor(message.author.id > target.id ? "RED" : "BLUE").setAuthor(`${turner.username}'s turn! ${message.author.id > target.id ? "🟥" : "🟦"}`, turner.displayAvatarURL({format: 'png'}))],
            components: boardInit(game)
        });  
    }
}     

module.exports.button = async (client, interaction) => {
    var embed = new MessageEmbed().setColor(client.randToastColor()).setTitle("** **              TicTacToe              ** **");
    var target = await client.tictactoe.get(interaction.user.id) || 0;
    var games = client.tictactoe.get(parseInt(interaction.user.id) + parseInt(target));
    games.board[interaction.customId.split('_')[1].charAt(0)][interaction.customId.split('_')[1].charAt(1)] = interaction.user.id > target ? "x" : "o";
    if (games.solo) {
        setTimeout(() => {
            var x, y;
            do {
                x = Math.floor(Math.random() * 3);
                y = Math.floor(Math.random() * 3);
            } while (games.board[x][y])
            games.board[x][y] = interaction.user.id > target ? "o" : "x";
            interaction.customId = `tictactoast_${x}${y}_${games.turn}_games`;
            this.button(client, interaction);
        }, 2000);
    }
    games.turn = target;
    const winner = await client.users.fetch(interaction.user.id);
    if (target == 'bot')target = client.user.id;
    const turner = await client.users.fetch(target);
    const turnout = hasWon(games.board);
    if (turnout == 'x' || turnout == 'o') {
        games.board = games.board.map(row => row.map(square => square ? square : 'fin'));
        client.tictactoe.delete(parseInt(interaction.user.id) + parseInt(target));
        embed.setColor(message.author.id > target.id ? "RED" : "BLUE").setAuthor(`${winner.username} has won! ${target > interaction.user.id ? "🟥" : "🟦"}`, winner.displayAvatarURL({format: 'png'}));
    } else if (turnout == 'tie') {
        client.tictactoe.delete(parseInt(interaction.user.id) + parseInt(target));
        embed.setDescription('Aw it was a tie.');
    } else {
        await client.tictactoe.set(parseInt(interaction.user.id) + parseInt(target), games);
        embed.setColor(message.author.id > target.id ? "RED" : "BLUE").setAuthor(`${turner.username}'s turn! ${interaction.user.id > target ? "🟥" : "🟦"}`, turner.displayAvatarURL({format: 'png'}));
    };
    try {
        await interaction.update({
            embeds: [embed],
            components: boardInit(games)
        });  
    } catch {
        await interaction.editReply({
            embeds: [embed],
            components: boardInit(games)
        });  
    }
}