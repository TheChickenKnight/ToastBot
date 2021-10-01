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
        let webhooks = await message.channel.fetchWebhooks().filter(item => item.owner.id == 873255148338688060);
        if (!webhooks[0]) {
            message.channel.createWebhook('ToastHook:' + message.channel.id);
            webhooks = await message.channel.fetchWebhooks().filter(item => item.owner.id == 873255148338688060);
        }
        const del = client.snipe.get(message.guildId);
        const person = await client.users.fetch(del.author.id);
        message.reply({ content: 'ᵖˢˢᵗ ʰᵉʳᵉ ʸᵒᵘ ᵍᵒ', ephemeral: true });
        await webhooks[0].send({ content: del.content, username:  person.username, avatarURL: person.displayAvatarURL({format: 'png'})});
    } else message.reply({ embeds: [new MessageEmbed().setDescription('❌ There was nothing to snipe!').setColor("#ff0000")]});
}