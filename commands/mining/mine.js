import { MessageEmbed } from 'discord.js';

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
        if (miningStatus[0] == 'dead')
            miningStatus = `You died by a **${miningStatus[1].charAt(0).toUpperCase() + miningStatus[1].slice(1)} Trap** in the **${miningStatus[1].charAt(0).toUpperCase() + miningStatus[1].slice(1)} Mines**.`;
        else 
            miningStatus = `You are currently mining in the **${miningStatus[1].charAt(0).toUpperCase() + miningStatus[1].slice(1)} Mines**!`;
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
            )]
    });
}