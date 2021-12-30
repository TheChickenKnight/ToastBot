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
            var specs = !square ? { 
                style: 'SECONDARY', 
                label: '🍞', 
                disabled: false 
            } : (square == 'x' ? 
                { 
                    style: 'PRIMARY', 
                    label: '<:peanutbutter:877666741994541066>', 
                    disabled: true 
                } : (square == 'o' ? 
                    { 
                        style: 'DANGER', 
                        label: '<:jam:877665567341948959>', 
                        disabled: true 
                    } : { 
                        style: 'SECONDARY', 
                        label: '🍞', 
                        disabled: true 
                    }
                )
            );
            ActionRow.addComponents(
                new MessageButton()
                    .setCustomId(`tictactoast_${x}${y}_${game.turn}_games`)
                    .setStyle(specs.style)
                    .setEmoji(specs.label)
                    .setDisabled(specs.disabled)
            );
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
        row.forEach(square => {
            if (!square)tie = false
        }); //tie
    });//horizontal
    if (hor)return hor;
    for (let i = 0; i < 3; i ++) {
        if (board[0][i] == 'x' && board[1][i] == 'x' && board[2][i] == 'x')return 'x';
        if (board[0][i] == 'o' && board[1][i] == 'o' && board[2][i] == 'o')return 'o';
    }//vertical
    return hor ? 
        hor : 
        ((board[0][0] == 'x' && board[1][1] == 'x' && board[2][2] == 'x') || (board[0][2] == 'x' && board[1][1] == 'x' && board[2][0] == 'x') ? 
            'x' : 
            ((board[0][0] == 'o' && board[1][1] == 'o' && board[2][2] == 'o') || (board[0][2] == 'o' && board[1][1] == 'o' && board[2][0] == 'o') ? 
                'o' :
                (tie ? 'tie' : false)
            )
        );
} 

module.exports.run = async (client, message, args) => { 
    var embed = new MessageEmbed()
        .setColor(client.randToastColor())
        .setTitle("** **              TicTacToe              ** **");
    var target = message.mentions.members.first();
    if (!target || target.id == message.author.id)return client.error(message, 'You can\'t play TicTacToast by youself')
    else if (client.tictactoe.has(message.author.id + target.id))return client.error(message, `You're already in a game with ${target}`);
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
        client.tictactoe.set(parseInt(message.author.id) + parseInt(target.id), game);
        client.tictactoe.set(message.author.id, target.id);
        client.tictactoe.set(target.id, message.author.id);
        await message.reply({
            embeds: [
                embed
                    .setColor(message.author.id > target.id ? "BLUE" : "RED")
                    .setAuthor(`${turner.username}'s turn! ${message.author.id > target.id ? "🟦" : "🟥"}`, turner.displayAvatarURL({format: 'png'}))
            ],
            components: boardInit(game)
        });  
    }
}     

module.exports.button = async (client, interaction) => {
    var embed = new MessageEmbed()
        .setColor(client.randToastColor())
        .setTitle("** **              TicTacToe              ** **");
    const target = await client.tictactoe.get(interaction.user.id) || 0;
    var games = client.tictactoe.get(parseInt(interaction.user.id) + parseInt(target));
    games.board[interaction.customId.split('_')[1].charAt(0)][interaction.customId.split('_')[1].charAt(1)] = interaction.user.id > target ? "x" : "o";
    if (!Object.keys(games).includes('history'))games.history = [];
    games.history.push({ 
        turn: games.turn, 
        board: games.board[0].concat(games.board[1], games.board[2]), 
        move: parseInt(interaction.customId.split('_').charAt(0)) * 3 + interaction.customId.split('_').charAt(1) + 1 
    });
    games.turn = target;
    const winner = await client.users.fetch(interaction.user.id);
    const turner = await client.users.fetch(target);
    const turnout = hasWon(games.board);
    if (turnout === 'x' || turnout === 'o') {
        const nn = await client.neural({input: 9, output: 1, name: 'tictactoe', layers: [{ nodes: 3}], activation: 'leakyReLU'});
        games.history.filter(game => game.turn === interaction.user.id).forEach(game => {
            for(let i = 0; i < 1000; i++)nn.backpropagate(ttt(game.board, turnout), [game.move]);
        });
        games.board = games.board.map(row => row.map(square => square ? square : 'fin'));
        client.tictactoe.delete(parseInt(interaction.user.id) + parseInt(target));
        embed.setColor(target > interaction.user.id ? "BLUE" : "RED").setAuthor(`${winner.username} has won! ${target > interaction.user.id ? "🟥" : "🟦"}`, winner.displayAvatarURL({format: 'png'}));
    } else if (turnout == 'tie') {
        const nn = await client.neural({input: 9, output: 1, name: 'tictactoe', layers: [{ nodes: 3}], activation: 'leakyReLU'});
        games.history.forEach(game => {
            for(let i = 0; i < 500; i++)nn.backpropagate(ttt(game.board, turnout), game.move);
        });
        client.tictactoe.delete(parseInt(interaction.user.id) + parseInt(target));
        embed.setDescription('Aw it was a tie.');
    } else {
        await client.tictactoe.set(parseInt(interaction.user.id) + parseInt(target), games);
        embed.setColor(target > interaction.user.id ? "BLUE" : "RED").setAuthor(`${turner.username}'s turn! ${interaction.user.id > target ? "🟥" : "🟦"}`, turner.displayAvatarURL({format: 'png'}));
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

const ttt = (arr, me) => arr[0].split('').concat(arr[1].split(''), arr[2].split('')).map(item => (me === 'x' ? ['', 'o', 'x'] : ['', 'x', 'o']).indexOf(item));