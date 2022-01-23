export const info = {
    name: 'queue',
    cooldown: 2,
    section: 'music',
    description: 'Allows you to view the current queue',
    usage: '<`prefix`>queue'
};

import { MessageSelectMenu, MessageActionRow } from 'discord.js';

export async function run(client, message, args) {
    const queue = client.queues.get(message.channel.guildId) || undefined;
    if (!queue)return client.error(message, 'The queue is currently empty.');
    const embed = await client.createEmbed(queue.queue[queue.pos], message.author.id, queue);
    console.log(embed);
    message.reply({
        embeds: [embed[1]],
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .addOptions(
                            queue.titles.map(
                                (song, i) => {
                                    return {
                                        label: song,
                                        value: queue.queue[i],
                                        description: queue.times[i],
                                        default: i == queue.pos
                                    };
                                }
                            )
                        ).setCustomId(`queue_menu_${message.author.id}_music`)
                )
        ]
    });
}

export async function menu(client, interaction) {
    const queue = client.queues.get(interaction.channel.guildId) || undefined;
    if (!queue)return client.error(message, 'The queue is currently empty.');
    interaction.update({
        embeds: [
            await client.createEmbed(interaction.values[0], interaction.user.id, queue)
        ]
    });
}