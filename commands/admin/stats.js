import { MessageEmbed } from "discord.js";

export const info = {
    name: 'stats',
    cooldown: 1,
    section: 'admin',
    description: 'check the most used commands!',
    usage: '<`prefix`>stats'
};

export function run(client, message, args) {
    const sort = Array.from(client.stats).sort((a, b) => b[1] - a[1]);
    message.reply({
        embeds: [ new MessageEmbed().setDescription(sort.map(stat => 't!' + stat[0] + ' ' + client.barCreate((stat[1] / sort[0][1]) * 100) + ' ' + stat[1]).join('\n') + '\u200b')]
    });
}