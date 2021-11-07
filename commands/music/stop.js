module.exports.info = {
    name: 'stop',
    cooldown: 2,
    section: 'music',
    description: 'stops the song and clears the queue!',
    usage: '<`prefix`>stop'
};

module.exports.run = (client, message, args) => {
    if (client.player) {
        client.queues.set(message.guild.id, ['stop']);
        client.player.stop();    
    } else message.reply({embeds:[new MessageEmbed().setColor('RED').setDescription('No songs are currently playing!')]});
}