module.exports.info = {
    name: 'stop',
    cooldown: 2,
    section: 'music',
    description: 'stops the song and clears the queue!',
    usage: '<`prefix`>stop'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.voice.channel.id)message.reply({embeds: [new MessageEmbed().setColor('RED').setDescription('You have to be in a VC to use this command!')]});
    else if (client.player) {
        client.queues.set(message.guild.id, ['stop']);
        client.player.stop();    
    } else message.reply({embeds:[new MessageEmbed().setColor('RED').setDescription('No songs are currently playing!')]});
}