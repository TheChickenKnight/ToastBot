module.exports.info = {
    name: 'train',
    cooldown: 20,
    section: 'rpg',
    description: 'do you even lift bro?',
    usage: '<`prefix`>rpg'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    var user = db.get(`users.${message.author.id}.rpg`);
    message.reply({
       embeds: [new MessageEmbed()
        .setColor(client.randToastColor())]
    });
}