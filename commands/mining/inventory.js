import { MessageEmbed } from "discord.js";

export const info = {
    name: 'inventory',
    cooldown: 5,
    section: 'mining',
    description: 'Currently under development!',
    usage: 'inv'
};

export async function run(client, message, args) {
    if (message.author.id != process.env.OWNER_ID)
        return message.reply({
            content: client.tips(),
            embeds: [new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('Sorry, this command is currently unavailable but is being actively developed!')]
        });
}