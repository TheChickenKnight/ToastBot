import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';

export const info = {
    name: 'mine',
    cooldown: 5,
    section: 'mining',
    description: 'Currently under development!',
    usage: 'mine'
};

export async function run(client, message, args) {
    if (message.author.id != process.env.OWNER_ID)
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('Sorry, this command is currently unavailable but is being actively developed!')]
        });
    const user = await client.mineGet(message.author.id, 'all');
    var miningStatus;
    if (user.miningStatus == 'idle')
        miningStatus = 'You are currently not mining!';
    else {
        miningStatus = user.miningStatus.split('_');
        miningStatus = (miningStatus[0] == 'dead') ? 
            (`You died by a **${miningStatus[1].charAt(0).toUpperCase() + miningStatus[1].slice(1)} Trap** in the **${miningStatus[1].charAt(0).toUpperCase() + miningStatus[1].slice(1)} Mines**.`) : 
            (`You are currently mining in the **${miningStatus[1].charAt(0).toUpperCase() + miningStatus[1].slice(1)} Mines**!`);
    }
    message.reply({
        embeds: [new MessageEmbed()
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
        ],
        components: [new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`mine_menu_${message.author.id}_mining`)
                .addOptions(
                    { label: 'Profile', description: 'A list of your stats', default: true, value: 'mine', emoji: '🧍'},
                    { label: 'Inventory', description: 'Current ores from your mine!', value: 'inventory' },
                    { label: 'Status', description: 'More stats on your current expedition', value: 'mineStatus' }
                )
        )]
    });
}