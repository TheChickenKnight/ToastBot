
export const info = {
    name: 'profile',
    cooldown: 5,
    section: 'economy',
    description: 'Shows your all of your stats!',
    usage: 'profile'
};

import { MessageEmbed } from "discord.js";
import { Economier } from "../classes/Economier.js";

export async function run(client, message, args) {
    const obj = await client.redis.get(`economy_${message.author.id}`);
    const user = new Economier(obj ? obj : {});
    await message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setThumbnail(message.member.displayAvatarURL({ type: 'png' }))
                .setDescription('EXP: ' + user.exp)
        ]
    });
}