export const info = {
    name: 'mineStatus',
    cooldown: 5,
    section: 'mining',
    aliases: ['mst'],
    description: 'Currently under development!',
    usage: 'mineStatus'
};

export async function run(client, message, args) {
    if (message.author.id != process.env.OWNER_ID)
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('Sorry, this command is currently unavailable but is being actively developed!')]
        });
    const user = await client.mineGet(message.author.id, 'all');
    console.log(user);
}