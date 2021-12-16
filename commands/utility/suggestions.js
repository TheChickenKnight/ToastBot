const { MessageSelectMenu } = require("discord.js");

module.exports.info = {
    name: 'suggestions',
    cooldown: 3,
    section: 'utility',
    aliases: ['suggestion'],
    description: 'view all current suggestions!',
    usage: 'suggestions/suggestion'
};

module.exports.run = async (client, message, args) => {
    let menu = new MessageSelectMenu()
        .setCustomId(`suggestions_menu_${message.author.id}_utility`)
        .setPlaceholder('Polls');
    let suggestions = await client.redis.KEYS('suggestion_*');
    const votes = await suggestions.map(async (sg, i) => {
        return client.redis.SMEMBERS(sg).then(members => {
            return members;
        });
    })
    console.log(votes);
};