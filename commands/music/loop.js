module.exports.info = {
    name: 'loop',
    cooldown: 2,
    section: 'music',
    description: 'Lets you loop the current queue!',
    usage: '<`prefix`>loop'
};

const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    const queue = client.queues.get(message.guild.id);
    client.queues.set(message.guild.id, { loop: !queue.loop, pos: queue.pos, queue: queue.queue });
    message.reply({embeds: [new MessageEmbed().setColor('GREEN').setDescription(queue.loop ? 'stopped the current loop!' : 'looping the current queue!')]});
};