module.exports.info = {
    name: 'info',
    aliases: ['inf'],
    cooldown: 20,
    section: 'general',
    description: 'info on people! Set your own!',
    usage: 'info/inf <@ someone|none>'
}

const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {
    const user = message.mentions.members.first() || await client.users.fetch(message.author.id);
    const person = db.get(`users.${user.id}.info`);
    var menu = new MessageSelectMenu().setCustomId(`info_${user.id}_${message.author.id}_general`);
    var embed = new MessageEmbed().setColor(client.randToastColor()).setAuthor(user.username, user.displayAvatarURL({format: 'png'}));
    var objArr = Object.entries(person);
    if (objArr.length < 1) {
        menu.setDisabled(true).setOptions({label: 'disabled', value: 'disabled'}).setPlaceholder('Empty!');
        embed.setDescription('nothing currently set, but im sure they\'re a nice guy!');
        await message.reply({embeds: [embed]});
    } else {
        menu.setPlaceholder('Pick Info!');
        objArr.forEach(([key, value]) => menu.addOptions({label: key.charAt(0).toUpperCase() + key.slice(1), value: key, description: 'test'}));
        await message.reply({
            embeds: [embed],
            components: [new MessageActionRow().addComponents(menu), buttonRow]
        });
    }
}

module.exports.menu = async (client, interaction) => {
    var buttonRow = new MessageActionRow.addComponents(
        new MessageButton()
            .setLabel('Show')
            .setStyle('PRIMARY')
            .setCustomId(`info_show_${message.author.id}_general`),
        new MessageButton()
            .setLabel('Hide')
            .setStyle('SECONDARY')
            .setCustomId(`info_hide_${message.author.id}_general`)
    );
    const person = db.get(`users.${interaction.customId.split('_')[1]}.info`);
    const user = await client.users.fetch(interaction.customId.split('_')[1]);
    var embed = new MessageEmbed()
        .setColor(client.randToastColor())
        .setAuthor(user.username, user.displayAvatarURL({format: 'png'}));
    var menu = new MessageSelectMenu()
        .setCustomId(`info_${user.id}_${interaction.user.id}_general`);
}