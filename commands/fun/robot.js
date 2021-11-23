module.exports.info = {
    name: 'robot',
    cooldown: 1,
    aliases: ['rbt'],
    section: 'fun',
    description: 'heh tictactoe again??',
    usage: '<`prefix`>robot X00 XOO XO0',
};

const Dannjs = require('dannjs');

module.exports.run = (client, message, args) => {
    if (args.length !== 4 || args[0].length !== 3 || args[1].length !== 3 || args[2].length !== 3)return message.reply('Wrong args!');
    if (!(await client.redis.EXISTS('neural_tictactoe'))) {
        num = new Dannjs.dann(9, 1);
        num.addHiddenLayer(3, 'sigmoid');
        num.makeWeights();
        num.outputActivation('leakyReLU');
    } else num = Dann.createFromJSON(JSON.parse(await client.redis.get('neural_tictactoe')));
    const input = ttt(args.splice(0, 3));
    await thousand(num.backpropagate(input, parseInt(args[3])));
    await client.redis.set('neural_tictactoe', JSON.stringify(num.toJSON()));
    message.reply('Okay... That make\'s sense');
}


const thousand = async (func) => {for(let i = 0; i < 1000; i++)func};
const ttt = (arr) => arr[0].split('').concat(arr[1].split('').concat(arr[2].split(''))).map(item => ['0', 'o', 'x'].indexOf(item));