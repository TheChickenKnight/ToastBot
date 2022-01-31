import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";

export const info = {
    name: 'mineStatus',
    cooldown: 5,
    section: 'mining',
    aliases: ['mst'],
    description: 'Currently under development!',
    usage: 'mineStatus'
};

export async function run(client, message, args, interaction) {
    if (message.author.id != process.env.OWNER_ID)
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('Sorry, this command is currently unavailable but is being actively developed!')]
        });
    const user = await client.mineGet(message.author.id);
    const embed = new MessageEmbed().setDescription('this is a test!');
    const parameters = {
        embeds: [embed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`mineStatus_menu_${message.author.id}_mining`)
                        .addOptions(
                            { label: 'Profile', description: 'A list of your stats', value: 'profile', emoji: '🧍'},
                            { label: 'Mines', description: 'All of the mines you can go to and start mining!', value: 'mine', emoji: '⛰️'},
                            { label: 'Ores Inventory', description: 'Current ores from your mine!', value: 'ores', emoji: '<:iron:869701384235253771>'},
                            { label: 'Mores Inventory', description: 'Every other item is here', value: 'inventory', emoji: '⛏️' },
                            { label: 'Status', description: 'More stats on your current expedition', default: true, value: 'mineStatus', emoji: '🔁' }
                        )
                    )
            ]
    }
    if (interaction)
        interaction.update(parameters);
    else 
        message.reply(parameters);
}

export function menu(client, interaction) {
    import('./' + interaction.values[0] +'.js').then(file => file.run(client, { author: interaction.user }, [], interaction));
}