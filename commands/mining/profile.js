import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';

export const info = {
    name: 'profile',
    cooldown: 5,
    section: 'mining',
    description: 'Currently under development!',
    usage: 'profile'
};

export async function run(client, message, args, interaction) {
    if (message.author.id != process.env.OWNER_ID)
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('Sorry, this command is currently unavailable but is being actively developed!')]
        });
    const user = await client.mineGet(message.author.id);
    console.log(user);
    var miningStatus;
    if (user.miningStatus.status == 'idle')
        miningStatus = 'You are currently not mining!';
    else 
        miningStatus = (user.miningStatus.status == 'dead') ? 
            (`You died by a **${client.caps(user.miningStatus.trap)} Trap** in the **${client.caps(user.miningStatus.location)} Mines**.`) : 
            (`You are currently mining in the **${client.caps(user.miningStatus.location)} Mines**!`);
    const embed = new MessageEmbed()
        .setColor(client.randToastColor())
        .setTitle('Mining Interface')
        .addFields(
            {
                name: `Level ${Math.floor(user.level / 100)}`,
                value: `${client.barCreate(user.level - (user.level % 100))}\n**${user.level - (user.level % 100)}/100** XP`
            },
            {
                name: 'Mining Status',
                value: miningStatus
            }
        )
    if (interaction)
        interaction.update({embeds: [embed]});
    else 
        message.reply({
            embeds: [embed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`mine_menu_${message.author.id}_mining`)
                        .addOptions(
                            { label: 'Profile', description: 'A list of your stats', default: true, value: 'profile', emoji: '🧍'},
                            { label: 'Mines', description: 'All of the mines you can go to and start mining!', value: 'mine', emoji: '🧍'},
                            { label: 'Ores Inventory', description: 'Current ores from your mine!', value: 'ores', emoji: '<:iron:869701384235253771>'},
                            { label: 'Mores Inventory', description: 'Every other item is here', value: 'inventory', emoji: '⛏️' },
                            { label: 'Status', description: 'More stats on your current expedition', value: 'mineStatus', emoji: '🔁' }
                        )
                    )
            ]
        });
}

export async function menu(client, interaction) {
    import('./' + interaction.values[0] +'.js').then(file => file.run(client, { author: interaction.user }, [], interaction));
}