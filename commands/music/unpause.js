export const info = {
    name: 'unpause',
    cooldown: 2,
    section: 'music',
    description: 'unpauses the queue if paused!',
    usage: '<`prefix`>unpause'
};

import { MessageEmbed } from 'discord.js';

export function run(client, message, args) {
    if (!message.member.voice.channel.id)
        client.error(message, 'You have to be in a VC to use this command!');
    else if (client.paused.has(message.guild.id)) {
        client.player.unpause();
        message.reply({ embeds: [new MessageEmbed().setDescription('Song was unpaused.')]});   
        client.paused.delete(message.guild.id);
    } else 
        client.error(message, 'Nothing is currently paused!');
}