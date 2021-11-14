module.exports.info = {
    name: 'prefix',
    cooldown: 10,
    section: 'utility',
    description: 'Lets you change the prefix or view it!',
    usage: '<`prefix`>prefix <`none`/`newPrefix`>'
}

const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const prefix = await client.redis.get(`guildSpec.${message.guildId}.prefix`);
    var embed = new MessageEmbed().setColor('#ff0000');
    const newPrefix = args.join(' ').replace(/"/g, '');
    if (!args[0])embed.setDescription(`The current prefix is \`${prefix}\`!`).setFooter('You can also ping me for this information!').setColor(client.randToastColor());
    else if (newPrefix.length > 6)embed.setDescription('A prefix cannot be longer than 6 letters!');
    else if (newPrefix == prefix)embed.setDescription('That\'s already the current prefix!');
    else {
        await client.redis.set(`guildSpec.${message.guildId}.prefix`, newPrefix);
        embed.setDescription(`Got it, the prefix(in this server) has been changed to \`${newPrefix}\`!`).setColor(client.randToastColor()).setFooter('Tip: if something isn\'t working right with the prefix, surround it with quotes(") first!');
    } message.reply({ embeds: [embed]});
}