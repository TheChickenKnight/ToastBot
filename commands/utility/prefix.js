export const info = {
    name: 'prefix',
    cooldown: 10,
    section: 'utility',
    description: 'Lets you change the prefix or view it!',
    usage: '<`prefix`>prefix <`none`/`newPrefix`>'
}

import { MessageEmbed } from 'discord.js';

export async function run(client, message, args) {
    const prefix = await client.redis.HGET(`guildSpec_${message.guildId}`, 'prefix'), 
        newPrefix = args.join(' ').replace(/"/g, '');
    var embed = new MessageEmbed().setColor('#ff0000');
    if (!args[0])
        embed.setDescription(`The current prefix is \`${prefix}\`!`).setFooter({text: 'You can also ping me for this information!'}).setColor(client.randToastColor());
    else if (newPrefix.length > 6)
        return client.error(message, 'A prefix cannot be longer than 6 letters!');
    else if (newPrefix == prefix)
        return client.error(message, 'That\'s already the current prefix!');
    else {
        await client.redis.HSET(`guildSpec_${message.guildId}`, 'prefix', newPrefix);
        embed.setDescription(`Got it, the prefix(in this server) has been changed to \`${newPrefix}\`!`).setColor(client.randToastColor()).setFooter({ text: 'Tip: if something isn\'t working right with the prefix, surround it with quotes(") first!'});
    } 
    message.reply({ embeds: [embed]});
}