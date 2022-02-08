export const info = {
    name: 'help',
    cooldown: 2,
    section: 'utility',
    description: 'Helps you with ur helping needs :D',
    usage: '<`prefix`>help <`none`/`commandName`/`commandAlias`>'
}

import { MessageEmbed, MessageActionRow, MessageSelectMenu, Collection } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

export async function run(client, message, args) {
    const prefix = await client.redis.HGET(`guildSpec_${message.guildId}`, 'prefix');
    if (!args[0] || (args[0].toLowerCase() !== 'admin' && client.folders.includes(args[0].toLowerCase()))) {
        var section = client.folders[1];
        if (args[0])
            section = args[0].toLowerCase();
        var answers = embedCreate(client, section, message.author.id, prefix);
        const msg = await message.reply({
            embeds: [answers[1]],
            components: [new MessageActionRow().addComponents(answers[0])]
        })
        if (!client.timeIDs.has('help'))
            await client.timeIDs.set('help', new Collection());
        if (client.timeIDs.get('help').has(message.author.id))
            await client.timeIDs.get('help').get(message.author.id).forEach(id => clearTimeout(id));
        await client.timeIDs.get('help').set(message.author.id, [setTimeout(async () => await msg.edit({components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('Disabled').setPlaceholder('Disabled!').addOptions([{label: 'disabled', description: 'disabled', value: 'disabled'}]).setDisabled(true))]}), 10000)]);
    } else {
        if (!client.commands.has(args[0].toLowerCase()))
            return client.error(message, 'Your search doesn\'t match any commands.');
        const infObj = client.commands.get(args[0].toLowerCase()).info;
        var infoEmbed = new MessageEmbed()
            .setColor(client.randToastColor())
            .setTitle(`${prefix}${args[0].charAt(0).toUpperCase()}${args[0].slice(1).toLowerCase()} Info:`)
            .setDescription(`**A ${infObj.section.charAt(0).toUpperCase()}${infObj.section.slice(1)} Command!**\n${infObj['description']}`)
            .addField('Cooldown', prettyMilliseconds(infObj.cooldown * 1000, {verbose: true}));
        const ignore = ['name', 'description', 'section', 'cooldown'];
        Object.keys(infObj).filter(word => !ignore.includes(word)).forEach(item => infoEmbed.addField(item.charAt(0).toUpperCase() + item.slice(1).replace(/_/g, ' '), infObj[item].toString()));
        message.reply({content: client.tips(), embeds: [infoEmbed]});
    }
}

export async function menu(client, interaction) {
    client.timeIDs.get(interaction.customId.split('_')[0]).get(interaction.user.id).forEach(id => clearTimeout(id));
    client.timeIDs.get(interaction.customId.split('_')[0]).set(interaction.user.id, [setTimeout(async () => await interaction.editReply({components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('Disabled').setPlaceholder('Disabled!').addOptions([{label: 'disabled', description: 'disabled', value: 'disabled'}]).setDisabled(true))]}), 10000)]);
    const prefix = await client.redis.HGET(`guildSpec_${interaction.message.guildId}`, 'prefix');
    const answers = embedCreate(client, interaction.values[0], interaction.user.id, prefix);
    await interaction.update({content: client.tips(),  embeds: [answers[1]], components: [new MessageActionRow().addComponents(answers[0])]});
}

function embedCreate(client, section, id, prefix) {
    var description = '';
    client.commands.forEach(command => description += (command.info.section == section ? `${prefix}[${command.info.name}](https://www.youtube.com/watch?v=dQw4w9WgXcQ)\n└ ${command.info.description}\n`: ''));
    var menu = new MessageSelectMenu().setCustomId(`help_menu_${id}_utility`).setPlaceholder(section.charAt(0).toUpperCase() + section.slice(1));
    client.folders.forEach(folder => menu.addOptions({ label: folder.charAt(0).toUpperCase() + folder.slice(1), value: folder }));
    return [menu, new MessageEmbed().setColor(client.randToastColor()).setTitle(`How to eat ${section.toUpperCase()} toast:`).setDescription(description)];
}