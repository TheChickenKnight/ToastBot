module.exports.info = {
    name: 'snipe',
    cooldown: 2,
    section: 'utility',
    description: 'Catches deleted messages!',
    usage: '<`prefix`>snipe'
}

const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    if (client.snipe.has(message.guildId)) {
        let webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == process.env.BOT_ID);
        if (!webhooks[0]) {
            await message.channel.createWebhook('ToastHook:' + message.channel.id);
            webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == process.env.BOT_ID);
        }
        const del = client.snipe.get(message.guildId);
        const person = await client.users.fetch(del.author.id);
        await webhooks[0][1].send({ content: del.content, username:  person.username, avatarURL: person.displayAvatarURL({format: 'png'})});
    } else client.error(message, '❌ There was nothing to snipe!');
}