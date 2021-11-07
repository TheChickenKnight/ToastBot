module.exports.info = {
    name: 'unpause',
    cooldown: 2,
    section: 'music',
    description: 'unpauses the queue if paused!',
    usage: '<`prefix`>unpause'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (client.paused.has(message.guild.id)) {
        client.player.unpause();
        message.reply({ embeds: [new MessageEmbed().setDescription('Song was unpaused.')]});   
        client.paused.delete(message.guild.id);
    } else message.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription('Nothing is currently paused!')]});
}