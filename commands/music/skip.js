const { MessageEmbed } = require("discord.js");

module.exports.info = {
    name: 'skip',
    cooldown: 2,
    section: 'music',
    description: 'Skips the current track!',
    usage: '<`prefix`>skip'
};

module.exports.run = (client, message, args) => {
    if (client.player)client.player.stop();
    else message.reply({embeds:[new MessageEmbed().setColor('RED').setDescription('No songs are currently playing!')]});
}