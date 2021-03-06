export const info = {
    name: 'pause',
    cooldown: 2,
    section: 'music',
    description: 'pauses the queue!',
    usage: '<`prefix`>stop'
};

import { MessageEmbed } from 'discord.js';

export function run(client, message, args) {
    if (!message.member.voice.channel.id)
        client.error(message, 'You have to be in a VC to use this command!');
    else if (client.player) {
        client.player.pause();
        message.reply({content: client.tips(), embeds: [new MessageEmbed().setDescription('Song was paused.')]});   
        client.paused.set(message.guild.id, true);
    } else 
        client.error(message, 'No songs are currently playing!');
}