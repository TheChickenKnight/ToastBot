module.exports.info = {
    name: 'math',
    cooldown: 1,
    aliases: ['num'],
    section: 'fun',
    description: 'n u m b e r s',
    usage: '<`prefix`>math <1-10> + <1-10>',
    important: 'The actual sum of the two numbers has to be less than 10!',
    ps: 'Yeah it\'s incredibly simple I know'
};

const Dannjs = require('dannjs');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (args.length !== 3 || args[1] != '+')return message.reply('Wrong args!');
    var num;
    if (!(await client.redis.EXISTS('neural_number'))) {
        num = new Dannjs.dann(2, 1);
        num.makeWeights();
        num.outputActivation('leakyReLU');
    } else num = Dann.createFromJSON(JSON.parse(await client.redis.get('neural_number')));
    args.splice(1, 1);
    args = args.map(arg => parseInt(arg));
    if (args[0] + args[1] > 10)return message.reply('Numbers TOO BIG!!!!')
    const answer = num.feedForward(args);
    const filter = m => message.author.id == m.author.id && /[0-9]+/.test(m.content) && parseInt(m.content) <= 10;
    const msg = await message.reply({embeds: [new MessageEmbed().setColor(client.randToastColor()).setDescription('I got ' + answer*10 + '. What\'s the real answer?').setFooter('I\'ll take an answer from anyone!')]});
    message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time']}).then(async messages => {
        num.backpropagate(args, [parseInt(messages.first().content)]);
        await client.redis.set('neural_number', JSON.stringify(num.toJSON()));
        msg.edit({embeds: [new MessageEmbed().setColor(client.randToastColor()).setDescription('Thanks for telling me that it\'s ' + messages.first().content)]});
    });
}