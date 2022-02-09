import { MessageEmbed } from "discord.js";

export const info = {
    name: 'feedback',
    cooldown: 30,
    section: 'utility',
    description: 'Offer any feedback directly to my developer!',
    information: 'Your name, profile picture, account creation date, discord tag, and your message will be sent!',
    usage: '<`prefix`>feedback <`message`>'
};

export async function run(client, message, args) {
    client.users.cache.get(process.env.OWNER_ID).send({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL({format: 'png'})
                })
                .setTitle('Feedback')
                .setTimestamp()
                .setDescription(args.join(' '))
        ]
    });
}