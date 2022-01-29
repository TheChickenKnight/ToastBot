import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const info = {
    name: 'rigged',
    cooldown: 5,
    section: 'games',
    description: 'uhhhh',
    not: 'rigged',
    usage: 'rigged'
};

export function run(client, message, args) {
    message.reply({
        embeds: [new MessageEmbed()
            .setColor(client.randToastColor())
            .setDescription('Rock, Paper, Scissors?')
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`rigged_Rock_${message.author.id}_games`)
                    .setStyle('PRIMARY')
                    .setEmoji('<:dwayne:936782666664120370>'),
                new MessageButton()
                    .setCustomId(`rigged_Paper_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('📰'),
                new MessageButton()
                    .setCustomId(`rigged_Scissors_${message.author.id}_games`)
                    .setStyle('SUCCESS')
                    .setEmoji('✂️')
            )
        ]
    })
};

export function button(client, interaction) {
    const chance = Math.floor(Math.random() * 3) + 1;
    const choice = interaction.customId.split('_')[1];
    interaction.update({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription(`${choice} ${(chance == 1) ? 'Beats' : ((chance == 2) ? 'Ties With' : 'Loses Against')} ${(choice == 'Rock') ? ((chance == 1) ? 'Scissors' : ((chance == 2) ? 'Rock' : 'Paper')) : ((choice == 'Paper') ? ((chance == 1) ? 'Rock' : ((chance == 2) ? 'Paper' : 'Scissors')) : ((chance == 1) ? 'Paper' : ((chance == 2) ? 'Scissors' : 'Rock')))}`)
                .setFooter({
                    text: 'You picked ' + choice
                })
        ],
        components: []
    })
}