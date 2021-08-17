module.exports.info = {
    name: 'snipe',
    cooldown: 2,
    section: 'general',
    description: 'Catches deleted messages!',
    usage: '<`prefix`>snipe'
}

const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    if (client.snipe.has(message.guildId)) {
        let webhooks = await message.channel.fetchWebhooks();
        var webhook;
        webhooks.forEach(item => {
            if (item.owner.id == 873255148338688060)webhook = item;
        });
        if (!webhook) {
            message.channel.createWebhook('ToastHook:' + message.channel.id);
            webhooks.forEach(item => {
                if (item.owner.id == 873255148338688060)webhook = item;
            });
        }
        const del = client.snipe.get(message.guildId);
        const person = await client.users.fetch(del.author.id);
        await webhook.send({
            content: del.content,
            username:  person.username,
            avatarURL: person.displayAvatarURL({format: 'png'}),
        });
    } else message.reply({ embeds: [new MessageEmbed()
        .setDescription('❌ There was nothing to snipe!')
        .setColor("#ff0000")]});
}
