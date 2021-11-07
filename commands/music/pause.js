module.exports.info = {
    name: 'pause',
    cooldown: 2,
    section: 'music',
    description: 'pauses the queue!',
    usage: '<`prefix`>stop'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.voice.channel.id)message.reply({embeds: [new MessageEmbed().setColor('RED').setDescription('You have to be in a VC to use this command!')]});
    else if (client.player) {
        client.player.pause();
        message.reply({ embeds: [new MessageEmbed().setDescription('Song was paused.')]});   
        client.paused.set(message.guild.id, true);
    } else message.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription('No songs are currently playing!')]});
}