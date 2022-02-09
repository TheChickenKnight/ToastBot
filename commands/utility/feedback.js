import {  MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const info = {
    name: 'feedback',
    cooldown: 30,
    section: 'utility',
    description: 'Offer any feedback directly to my developer!',
    information: 'Your username + tag, profile picture, account creation date, and your message will be sent!',
    usage: '<`prefix`>feedback <`message`>'
};

let embed;

export function run(client, message, args) {
    embed = new MessageEmbed()
        .setColor(client.randToastColor())
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({format: 'png'})
        })
        .setTitle('Feedback')
        .setTimestamp()
        .setDescription(args.join(' '));
    message.reply({
        content: client.tips(),
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('The following embed is the one that will be sent to the developer. Is this okay?')
                .setFooter({
                    text: '⬇️'
                }),
            embed
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel('✔️')
                    .setStyle('SUCCESS')
                    .setCustomId(`feedback_yes_${message.author.id}_utility`),
                new MessageButton()
                    .setLabel('❌')
                    .setStyle('DANGER')
                    .setCustomId(`feedback_no_${message.author.id}_utility`)
            )
        ]
    })
    
}

export async function button(client, interaction) {
    await interaction.update({
        components: []
    });
    let description;
    if (interaction.customId.split('_')[1] == 'yes') {
        await client.users.cache.get(process.env.OWNER_ID).send({
            embeds: [
                embed
            ]
        });
        description = 'Thanks! Feedback was sent!';
    } else 
        description = 'Alright, canceled!';
    interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription(description)
        ]
    });
}