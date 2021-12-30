module.exports.info = {
    name: 'skip',
    cooldown: 2,
    section: 'music',
    description: 'Skips the current track!',
    usage: '<`prefix`>skip'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.voice.channel.id)client.error(message, 'You have to be in a VC to use this command!');
    else if (client.player) {
        client.player.stop();
    } else client.error(message, 'No songs are currently playing!');
}