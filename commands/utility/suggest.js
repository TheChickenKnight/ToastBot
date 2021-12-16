const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.info = {
    name: 'suggest',
    cooldown: 3,
    section: 'utility',
    aliases: ['sgg'],
    description: 'suggest things yes!',
    usage: 'suggestion/suggest/sgg'
};

module.exports.run = async (client, message, args) => {
    if (!args[0])return message.reply('You need to suggest something!');
    let embed = new MessageEmbed().setColor(client.randToastColor()).setTitle(args.map(arg => arg.charAt(0).toUpperCase() + arg.slice(1).toLowerCase()).join(' '));
    let suggestions = [message.author.id];
    let suggestors = await client.redis.KEYS('suggestion_*');
    suggestors.filter(s => similar(s.split('_')[1], args.join(' ').toLowerCase()) > 2).sort((a, b) => a > b);
    if (await client.redis.EXISTS('suggestion_' + args.join(' ').toLowerCase())) {
        suggestions = await client.redis.SMEMBERS('suggestion_' + args.join(' ').toLowerCase());
        embed.setFooter('This suggestion exists already!');
    } else if (suggestors.length > 0)embed.addField('Similar', 'Similar to the `' + suggestors[0] + '`');
    await client.redis.SADD('suggestion_' + args.join(' ').toLowerCase(), message.author.id);
    message.reply({
        embeds: [embed.setDescription('`' + suggestions.length + '/3`\n'+ client.barCreate(suggestions.length * 100 / 3))],
        components: [new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('⬆️')
                .setCustomId(`suggest_${args.join(' ').toLowerCase()}_all_utility`)
        )]
    });
};

module.exports.button = async (client, interaction) => {
    let embed = new MessageEmbed().setColor(client.randToastColor()).setTitle(interaction.customId.split('_')[1].split(' ').map(arg => arg.charAt(0).toUpperCase() + arg.slice(1).toLowerCase()).join(' '));
    await client.redis.SADD('suggestion_' + interaction.customId.split('_')[1], interaction.user.id);
    const suggestions = await client.redis.SMEMBERS('suggestion_' + interaction.customId.split('_')[1]);
    try {
        interaction.update({
            embeds: [embed.setDescription('`' + suggestions.length + '/3`\n'+ client.barCreate(suggestions.length * 100 / 3))],
        });
    } catch {
        interaction.editReply({
            embeds: [embed.setDescription('`' + suggestions.length + '/3`\n'+ client.barCreate(suggestions.length * 100 / 3))],
        });
    }
};

const similar = (text1, text2) => text1.split(' ').filter(word => word.length > 3 && text2.split(' ').includes(word)).length;