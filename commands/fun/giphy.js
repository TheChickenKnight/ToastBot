module.exports.info = {
    name: 'giphy',
    cooldown: 3,
    section: 'fun',
    aliases: ['gif'],
    description: 'video thingies',
    usage: 'giphy/gif <word or phrase>'
};

const fetch = require('node-fetch');

module.exports.run = (client, message, args) => {
    if (!args[0])return client.error(message, 'you have to search something!');
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=yV0pIbTuvwp2FT7ahdDdxaqJbAPBA1YQ&limit=1&rating=pg-13&lang=en&offset=${Math.floor(Math.random()*10)}&q=${args.join(' ')}`)
        .then(res => res.json())
            .then(res => message.reply(res.data.filter(data => data.url)[0].url));
};