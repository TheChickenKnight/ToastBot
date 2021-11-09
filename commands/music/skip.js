module.exports.info = {
    name: 'skip',
    cooldown: 2,
    section: 'music',
    description: 'Skips the current track!',
    usage: '<`prefix`>skip'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.voice.channel.id)message.reply({embeds: [new MessageEmbed().setColor('RED').setDescription('You have to be in a VC to use this command!')]});
    else if (client.player) {
        client.player.stop();
    } else message.reply({embeds:[new MessageEmbed().setColor('RED').setDescription('No songs are currently playing!')]});
}