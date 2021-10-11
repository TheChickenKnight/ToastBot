module.exports.info = {
    name: 'info',
    aliases: ['inf'],
    cooldown: 20,
    section: 'general',
    description: 'info on people! Set your own!',
    usage: 'info/inf <@ someone|none>'
};

const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const db = require('quick.db');

const createButtonRow = (page, total, id, author) => {
    var mar = new MessageActionRow().addComponents(
        new MessageButton().setLabel("<").setCustomId(`info_left_${id}_general`).setStyle(page != 1 ? "PRIMARY" : "SECONDARY").setDisabled(page == 1),
        new MessageButton().setLabel(">").setCustomId(`info_right_${id}_general`).setStyle(page != total ? "PRIMARY" : "SECONDARY").setDisabled(page == total)
    );
    if (author == id)return [mar, new MessageActionRow().addComponents(new MessageButton().setLabel('Edit').setStyle('SECONDARY').setCustomId(`info_edit_${id}_general`))];
    return [mar];
}

module.exports.run = async (client, message, args) => {
    const user = message.mentions.members.first() || await client.users.fetch(message.author.id);
    var embed = new MessageEmbed().setColor(client.randToastColor()).setAuthor(user.username, user.displayAvatarURL({format: 'png'}));
    var objArr = Object.entries(db.get(`users.${user.id}.info`)).slice(10, objArr.length);
    if (objArr.length < 1)embed.setDescription('nothing currently set, but im sure they\'re a nice guy!');
    else objArr.forEach(([key, value]) => embed.addField(key.charAt(0).toUpperCase() + key.slice(1), value, true));
    message.reply({ embeds: [embed], components: createButtonRow(1, Math.ceil(objArr.length / 10), user.id, message.author.id)});
}

module.exports.button = (client, interaction) => {
    
}