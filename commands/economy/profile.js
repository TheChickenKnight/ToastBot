export const info = {
    name: 'profile',
    cooldown: 5,
    section: 'economy',
    description: 'Shows your all of your stats!',
    usage: 'profile'
};

import { MessageEmbed } from "discord.js";
import { Economier } from "../classes/Economier.js";
import lwip from "lwip";

const border_width = 10;

export async function run(client, message, args) {
    const user = new Economier(await client.redis.get(`economy_${message.author.id}`) || {});
    lwip.open(message.member.displayAvatarURL({ type: 'png' }), (err, img) => {
        if (err) {}
        
    });
    await message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setThumbnail(message.member.displayAvatarURL({ type: 'png' }))
                .setDescription('EXP: ' + user.exp)
        ]
    });
}