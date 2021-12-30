module.exports.info = {
    name: 'stop',
    cooldown: 2,
    section: 'music',
    description: 'stops the song and clears the queue!',
    usage: '<`prefix`>stop'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.voice.channel.id)client.error(message, 'You have to be in a VC to use this command!');
    else if (client.player) {
        client.queues.set(message.guild.id, { pos: 0, queue: []});
        client.player.stop();    
    } else client.error(message, 'No songs are currently playing!');
}