import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const info = {
    name: 'vote',
    cooldown: 2,
    section: 'utility',
    description: 'Let\'s you vote for yours truly!',
    usage: '<`prefix`>vote'
};

export function run(client, message, args) {
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('This is greatly appreciated! Click the button below to vote for my bot! ')
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setURL('https://top.gg/bot/873255148338688060/vote')
                    .setLabel('Vote me!')
            )
        ]
    });
}
