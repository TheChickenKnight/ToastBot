module.exports.info = {
    name: 'help',
    cooldown: 2,
    section: 'general',
    description: 'Helps you with ur helping needs :D',
    usage: '<`prefix`>help <`none`/`commandName`/`commandAlias`>'
}

//init
const db = require('quick.db');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Collection } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports.run = async (client, message, args) => {
    const prefix = db.get(`guildSpec.${message.guildId}.prefix`);
    if (!args[0] || client.folders.includes(args[0].toLowerCase())) {
        var section = client.folders[0];
        if (args[0])section = args[0].toLowerCase();
        var answers = embedCreate(client, section, message.author.id, prefix);
        const msg = await message.reply({
            embeds: [answers[1]],
            components: [new MessageActionRow().addComponents(answers[0])]
        })
        if (!client.timeIDs.has('help'))await client.timeIDs.set('help', new Collection());
        if (client.timeIDs.get('help').has(message.author.id))await client.timeIDs.get('help').get(message.author.id).forEach(id => clearTimeout(id));
        await client.timeIDs.get('help').set(message.author.id, [setTimeout(async () => await msg.edit({components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('Disabled').setPlaceholder('Disabled!').addOptions([{label: 'disabled', description: 'disabled', value: 'disabled'}]).setDisabled(true))]}), 10000)]);
    } else {
        if (!client.commands.has(args[0].toLowerCase()))return message.reply('That\'s not a valid command! Spell better lmao');
        const infObj = client.commands.get(args[0].toLowerCase()).info;
        var infoEmbed = new MessageEmbed()
            .setColor(client.randToastColor())
            .setTitle(`${prefix}${args[0].charAt(0).toUpperCase()}${args[0].slice(1).toLowerCase()} Info:`)
            .setDescription(`**A ${infObj.section.charAt(0).toUpperCase()}${infObj.section.slice(1)} Command!**\n${infObj['description']}`)
            .addField('Cooldown', prettyMilliseconds(infObj.cooldown * 1000, {verbose: true}));
        Object.keys(infObj).filter(word => !['name', 'description', 'section', 'cooldown'].includes(word)).forEach(item => infoEmbed.addField(item.charAt(0).toUpperCase() + item.slice(1), infObj[item].toString()));
        message.reply({embeds: [infoEmbed]});
    }
}

module.exports.menu = async (client, interaction) => {
    const answers = embedCreate(client, interaction.values[0], interaction.user.id, db.get(`guildSpec.${interaction.message.guildId}.prefix`));
    await interaction.update({ embeds: [answers[1]], components: [new MessageActionRow().addComponents(answers[0])]});
}

const embedCreate = (client, section, id, prefix) => {
    var menu = new MessageSelectMenu().setCustomId(`help_menu_${id}_general`).setPlaceholder(section.charAt(0).toUpperCase() + section.slice(1));
    client.folders.forEach(folder => menu.addOptions({ label: folder.charAt(0).toUpperCase() + folder.slice(1), value: folder }));
    return [menu, new MessageEmbed().setColor(client.randToastColor()).setTitle(`How to eat ${section.toUpperCase()} toast:`).setDescription(client.commands.filter(command => command.info.section == section).map(command => `${prefix}[${command.info.name}](https://www.youtube.com/watch?v=dQw4w9WgXcQ)\n└ ${command.info.description}\n`).join(''))];
}