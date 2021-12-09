module.exports.info = {
    name: 'suggestion',
    cooldown: 20,
    section: 'utility',
    aliases: ['suggest', 'sgg'],
    description: 'suggest things yes!',
    usage: 'suggestion/suggest/sgg'
};

module.exports.run = (client, message, args) => {
    if (!args[0])return message.reply('You need to suggest something!');
    if (client.redis.HEXISTS(args[0].join(' ').toLowerCase())) {
        message.reply('This suggestion exists already!')
    } else {

    }
};